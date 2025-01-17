import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import {
  IParkingProperty,
  ITenant,
  ParkingSpotState,
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

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  private simulationIds = new Set<string>();
  private simulationIntervals = new Map<string, SimulationSpeed>();
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

    if (this.simulationIds.has(propertyId)) {
      this.logger.error('Simulation already running');
      return;
    }

    const intervalSpeed =
      SIMULATION_SPEEDS[speed] || SIMULATION_SPEEDS['normal'];
    this.logger.debug('Simulation Speed: ' + intervalSpeed);

    this.simulationIds.add(propertyId);
    this.simulationIntervals.set(propertyId, intervalSpeed);
    this.logger.debug(
      'Simulation Intervals: ' + JSON.stringify([...this.simulationIntervals]),
    );

    this.schedulerRegistry.addInterval(
      propertyId,
      setInterval(
        async () => this.runSimulation(token, tenantId, propertyId),
        intervalSpeed,
      ),
    );
    this.logger.log(
      `Simulation started for: ${propertyId} at speed: ${intervalSpeed}`,
    );
    const intervals = this.schedulerRegistry.getIntervals();
    this.logger.debug(`Active intervals: ${intervals.length}`);
  }

  async updateSimulationSpeed(
    token: string,
    tenantId: string,
    propertyId: string,
    newSpeed: string,
  ) {
    if (!this.simulationIds.has(propertyId)) {
      throw new Error('Simulation not running for this property');
    }

    this.schedulerRegistry.deleteInterval(propertyId);

    const newIntervalSpeed = SIMULATION_SPEEDS[newSpeed];

    this.schedulerRegistry.addInterval(
      propertyId,
      setInterval(
        async () => this.runSimulation(token, tenantId, propertyId),
        newIntervalSpeed,
      ),
    );

    this.simulationIntervals.set(propertyId, newIntervalSpeed);
    this.logger.debug(
      `Simulation speed updated for ${propertyId} to: ${newIntervalSpeed}`,
    );
  }

  async stopSimulation(token: string, tenantId: string, propertyId: string) {
    this.schedulerRegistry.deleteInterval(propertyId);

    await this.removeSimulationCars(token, tenantId, propertyId);

    this.simulationIds.delete(propertyId);
    this.simulationIntervals.delete(propertyId);
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
        );
        await this.parkingService.leave(token, tenantId, propertyId, {
          id: spot.customer.id,
          licensePlate: spot.customer.licensePlate,
        });
      }
    }
  }

  getSimulationStatus(propertyId: string) {
    // TODO maybe noch den Speed mit zurückgeben
    return this.simulationIds.has(propertyId);
  }

  async runSimulation(token: string, tenantId: string, propertyId: string) {
    this.logger.log('Running simulation for: ' + propertyId);
    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      propertyId,
    );
    this.logger.log('Found parking property: ' + parkingProperty.name);

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

    // Entscheidungslogik: Mehr Autos einfahren, wenn die Auslastung gering ist
    if (Math.random() > occupancyRate) {
      await this.simulateCarEntering(token, tenantId, propertyId, freeSpots);
    } else {
      await this.simulateCarExiting(token, tenantId, propertyId, occupiedSpots);
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
    });

    await this.parkingService.occupySpot(token, tenantId, propertyId, spot.id, {
      id,
      licensePlate: 'SIMULATION',
    });
  }

  private async simulateCarExiting(
    token: string,
    tenantId: string,
    propertyId: string,
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
      propertyId,
      spot.id,
      randomInt(1, 10),
    );

    const speed = this.simulationIntervals.get(propertyId) || 'normal';
    const leaveDelay = SIMULATION_SPEEDS[speed] / 2;

    setTimeout(async () => {
      const id = spot.customer.id;
      await this.parkingService.leave(token, tenantId, propertyId, {
        id,
        licensePlate: 'SIMULATION',
      });
    }, leaveDelay);
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
