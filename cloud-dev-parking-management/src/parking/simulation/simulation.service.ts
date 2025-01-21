import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import {
  IParkingProperty,
  ITenant,
  ParkingSpotState,
  SimulationState,
} from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';
import { getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { randomInt } from 'node:crypto';

const SIMULATION_SPEEDS = {
  slow: 10000, // 10 Sekunden
  normal: 5000, // 5 Sekunden
  fast: 1000, // 1 Sekunde
};

export type SimulationSpeed = keyof typeof SIMULATION_SPEEDS;

export type SimulationOptions = {
  speed: SimulationSpeed;
  locked: boolean;
};

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  private readonly parkingPropertiesApi: string;
  private tenantDb = getFirestore(getApp('tenant'));

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly parkingService: ParkingService,
    private readonly httpService: HttpService,
  ) {
    this.parkingPropertiesApi = this.config.get<string>(
      'PROPERTY_MANAGEMENT_API_URL',
    );
  }

  async startSimulation(
    token: string,
    tenantId: string,
    propertyId: string,
    speed?: string,
  ) {
    const tenant = (
      await this.tenantDb.collection('Tenants').doc(tenantId).get()
    ).data() as ITenant;
    if (!tenant) {
      this.logger.error('Not allowed as Free Tenant');
      return;
    }

    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      propertyId,
    );

    if (!parkingProperty) {
      throw new Error('Property not found');
    }

    if (parkingProperty.simulationState !== SimulationState.OFF) {
      throw new Error('Simulation already running');
    }

    const intervalSpeed =
      SIMULATION_SPEEDS[speed] || SIMULATION_SPEEDS['normal'];

    await this.updateSimulationState(
      token,
      tenantId,
      propertyId,
      this.mapSpeedToState(intervalSpeed),
    );

    this.schedulerRegistry.addInterval(
      propertyId,
      setInterval(
        async () => await this.runSimulation(token, tenantId, propertyId),
        intervalSpeed,
      ),
    );
    this.logger.log(
      `Simulation started for: ${propertyId} at speed: ${intervalSpeed}`,
    );
    const intervals = this.schedulerRegistry.getIntervals();
    this.logger.debug(`Active intervals: ${intervals.length}`);
  }

  private async updateSimulationState(
    token: string,
    tenantId: string,
    propertyId: string,
    state: SimulationState,
  ) {
    try {
      await lastValueFrom(
        this.httpService.patch(
          `${this.parkingPropertiesApi}/v1/parking-properties/${propertyId}`,
          { simulationState: state },
          {
            headers: {
              authorization: token,
              'tenant-id': tenantId,
            },
          },
        ),
      );

      this.logger.log(
        `Successfully updated simulationState to ${state} for property ${propertyId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update simulationState for property ${propertyId}: ${error.message}`,
      );
      throw error;
    }
  }

  private mapSpeedToState(speed: number): SimulationState {
    switch (speed) {
      case SIMULATION_SPEEDS.slow:
        return SimulationState.SLOW;
      case SIMULATION_SPEEDS.fast:
        return SimulationState.FAST;
      default:
        return SimulationState.NORMAL;
    }
  }

  async updateSimulationSpeed(
    token: string,
    tenantId: string,
    propertyId: string,
    newSpeed: string,
  ) {
    const newIntervalSpeed = SIMULATION_SPEEDS[newSpeed];
    const newState = this.mapSpeedToState(newIntervalSpeed);

    await this.updateSimulationState(token, tenantId, propertyId, newState);

    try {
      this.schedulerRegistry.deleteInterval(propertyId);
      this.schedulerRegistry.addInterval(
        propertyId,
        setInterval(
          async () => await this.runSimulation(token, tenantId, propertyId),
          newIntervalSpeed,
        ),
      );
    } catch (error) {
      this.logger.error(
        `Failed to update the simulation interval for property: ${propertyId} `,
        error,
      );
    }

    this.logger.debug(
      `Simulation speed updated for ${propertyId} to: ${newIntervalSpeed}`,
    );
  }

  async stopSimulation(token: string, tenantId: string, propertyId: string) {
    await this.updateSimulationState(
      token,
      tenantId,
      propertyId,
      SimulationState.OFF,
    );
    try {
      this.schedulerRegistry.deleteInterval(propertyId);
    } catch (error) {
      this.logger.error(
        `Failed to delete the simulation interval for property: ${propertyId} `,
        error,
      );
    }
    await this.removeSimulationCars(token, tenantId, propertyId);

    this.logger.log('Simulation stopped for: ' + propertyId);
  }

  private async removeSimulationCars(
    token: string,
    tenantId: string,
    propertyId: string,
  ) {
    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      propertyId,
    );

    const occupiedSpots = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .filter(
        (spot) =>
          spot.state === ParkingSpotState.OCCUPIED ||
          spot.state === ParkingSpotState.CHARGING,
      );

    for (const spot of occupiedSpots) {
      if (spot.customer?.licensePlate?.includes('SIMULATION')) {
        await this.parkingService.freeSpot(
          token,
          tenantId,
          propertyId,
          spot.id,
          undefined,
          parkingProperty,
        );
        await this.parkingService.leave(
          token,
          tenantId,
          propertyId,
          {
            id: spot.customer.id,
            licensePlate: spot.customer.licensePlate,
            toPay: 0,
            hasPayed: true,
          },
          parkingProperty,
        );
        parkingProperty.customers = parkingProperty.customers.filter((c) => {
          c.id !== spot.customer.id;
        });
      }
    }
  }

  async getSimulationStatus(
    token: string,
    tenantId: string,
    propertyId: string,
  ): Promise<boolean> {
    try {
      const parkingProperty = await this.fetchParkingProperty(
        token,
        tenantId,
        propertyId,
      );
      return parkingProperty.simulationState !== SimulationState.OFF;
    } catch (error) {
      this.logger.error(`Failed to get simulation status: ${error.message}`);
      return false; // Falls ein Fehler auftritt, gilt die Simulation als inaktiv
    }
  }

  async runSimulation(token: string, tenantId: string, propertyId: string) {
    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      propertyId,
    );
    this.logger.log('Running simulation for: ' + propertyId);
    if (parkingProperty.simulationState === SimulationState.OFF) {
      this.logger.log('Simulation is turned off for property: ' + propertyId);
      try {
        this.schedulerRegistry.deleteInterval(propertyId);
      } catch (error) {
        this.logger.error(
          `Failed to delete the simulation interval for property: ${propertyId} `,
          error,
        );
      }
      return;
    }

    const totalSpots = parkingProperty.layers.flatMap((l) => l.parkingSpots);
    const freeSpots = totalSpots.filter(
      (spot) => spot.state === ParkingSpotState.FREE,
    );
    const occupiedSpots = totalSpots.filter(
      (spot) =>
        spot.state === ParkingSpotState.OCCUPIED ||
        spot.state === ParkingSpotState.CHARGING,
    );

    const occupancyRate = occupiedSpots.length / totalSpots.length;

    if (Math.random() > occupancyRate) {
      await this.simulateCarEntering(token, tenantId, propertyId, freeSpots);
    } else {
      await this.simulateCarExiting(
        token,
        tenantId,
        parkingProperty,
        occupiedSpots,
      );
    }
  }

  private async simulateCarEntering(
    token: string,
    tenantId: string,
    propertyId: string,
    freeSpots: any[],
  ) {
    if (freeSpots.length === 0) {
      this.logger.warn('No free spots available');
      return;
    }

    // Wähle einen zufälligen freien Parkplatz
    const randomIndex = Math.floor(Math.random() * freeSpots.length);
    const spot = freeSpots[randomIndex];

    const id = crypto.randomUUID();
    await this.parkingService.enter(token, tenantId, propertyId, {
      id: id,
      licensePlate: 'SIMULATION',
      toPay: 0,
      hasPayed: false,
    });

    await this.parkingService.occupySpot(token, tenantId, propertyId, spot.id, {
      id,
      licensePlate: 'SIMULATION',
      toPay: 0,
      hasPayed: false,
    });
  }

  private async simulateCarExiting(
    token: string,
    tenantId: string,
    parkingProperty: IParkingProperty,
    occupiedSpots: any[],
  ) {
    if (occupiedSpots.length === 0) {
      this.logger.warn('No occupied spots left');
      return;
    }

    const randomIndex = Math.floor(Math.random() * occupiedSpots.length);
    const spot = occupiedSpots[randomIndex];
    await this.parkingService.freeSpot(
      token,
      tenantId,
      parkingProperty.id,
      spot.id,
      randomInt(1, 10),
    );
    const customer = parkingProperty.customers.find(
      (c) => c.id === spot.customer.id,
    );
    const id = spot.customer.id;
    await this.parkingService.leave(token, tenantId, parkingProperty.id, {
      id,
      licensePlate: 'SIMULATION',
      toPay: customer?.toPay ?? 0,
      hasPayed: customer?.hasPayed ?? false,
    });
  }

  private async fetchParkingProperty(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<IParkingProperty>(
          `${this.parkingPropertiesApi}/v1/parking-properties/${parkingPropertyId}`,
          {
            headers: {
              authorization: token,
              'tenant-id': tenantId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch parking property: ${error.message}`);
      throw new Error('Parking Property not found');
    }
  }
}
