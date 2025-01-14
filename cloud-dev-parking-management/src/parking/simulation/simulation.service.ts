import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import { IParkingProperty, ParkingSpotState } from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';

const SIMULATION_SPEEDS = {
  slow: 10000, // 10 Sekunden
  normal: 5000, // 5 Sekunden
  fast: 1000, // 1 Sekunde
};

type SimulationSpeed = keyof typeof SIMULATION_SPEEDS;

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  private simulationIds = new Set<string>();
  private simulationIntervals = new Map<string, SimulationSpeed>();
  private readonly parkingPropertiesApi: string;

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
    speed: SimulationSpeed = 'normal',
  ) {
    if (this.simulationIds.has(propertyId)) {
      this.logger.error('Simulation already running');
      return;
    }

    this.simulationIds.add(propertyId);
    this.simulationIntervals.set(propertyId, speed);

    this.schedulerRegistry.addInterval(
      propertyId,
      setInterval(
        async () => this.runSimulation(token, tenantId, propertyId),
        SIMULATION_SPEEDS[speed],
      ),
    );
    this.logger.log(`Simulation started for: ${propertyId} at speed: ${speed}`);
  }

  async stopSimulation(token: string, tenantId: string, propertyId: string) {
    this.schedulerRegistry.deleteInterval(propertyId);

    await this.removeSimulationCars(token, tenantId, propertyId);

    this.simulationIds.delete(propertyId);
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
      .filter((spot) => spot.state === ParkingSpotState.OCCUPIED);

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

  async updateSimulationSpeed(propertyId: string, newSpeed: SimulationSpeed) {
    if (!this.simulationIds.has(propertyId)) {
      throw new Error('Simulation not running for this property');
    }

    // Entferne das alte Intervall
    this.schedulerRegistry.deleteInterval(propertyId);

    // Füge das neue Intervall hinzu
    this.schedulerRegistry.addInterval(
      propertyId,
      setInterval(
        async () =>
          this.runSimulation(
            null, // Du kannst hier optional die Token- und Tenant-Logik erweitern
            null,
            propertyId,
          ),
        SIMULATION_SPEEDS[newSpeed],
      ),
    );

    this.simulationIntervals.set(propertyId, newSpeed);
    this.logger.log(
      `Simulation speed updated for ${propertyId} to: ${newSpeed}`,
    );
  }

  getSimulationStatus(propertyId: string) {
    // TODO maybe noch den Speed mit zurückgeben
    return this.simulationIds.has(propertyId);
  }

  async runSimulation(token: string, tenantId: string, propertyId: string) {
    if (this.config.get('FIRESTORE_DB') === 'prod') {
      this.logger.error('Simulation not allowed in production');
      return;
    }

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
      (spot) => spot.state === ParkingSpotState.OCCUPIED,
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

    const id = crypto.randomUUID();
    await this.parkingService.enter(token, tenantId, propertyId, {
      id: id,
      licensePlate: 'SIMULATION',
    });

    const spot = freeSpots[0]; // Nimm den ersten freien Platz
    await this.parkingService.occupySpot(token, tenantId, propertyId, spot.id, {
      id,
      licensePlate: 'SIMULATION',
    });

    if (spot.electricCharging) {
      const speed = this.simulationIntervals.get(propertyId) || 'normal';
      const chargeDelay = SIMULATION_SPEEDS[speed] / 5;

      setTimeout(async () => {
        await this.parkingService.chargeSpot(
          token,
          tenantId,
          propertyId,
          spot.id,
        );
      }, chargeDelay);
    }
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

    const spot = occupiedSpots[0]; // Nimm den ersten belegten Platz
    await this.parkingService.freeSpot(token, tenantId, propertyId, spot.id);

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
