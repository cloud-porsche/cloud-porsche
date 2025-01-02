import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import { IParkingProperty, ParkingSpotState } from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';

const SIMULATION_INTERVAL = 10000;

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  private simulationIds = new Set<string>();
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

  async startSimulation(propertyId: string) {
    if (this.simulationIds.has(propertyId)) {
      this.logger.error('Simulation already running');
      return;
    }

    this.simulationIds.add(propertyId);
    this.schedulerRegistry.addInterval(
      'simulation',
      setInterval(
        async () => this.runSimulation(propertyId),
        SIMULATION_INTERVAL,
      ),
    );
    this.logger.log('Simulation started for: ' + propertyId);
  }

  async stopSimulation(propertyId: string) {
    this.schedulerRegistry.deleteInterval('simulation');

    await this.removeSimulationCars(propertyId);

    this.simulationIds.delete(propertyId);
    this.logger.log('Simulation stopped for: ' + propertyId);
  }

  private async removeSimulationCars(propertyId: string) {
    const parkingProperty = await this.fetchParkingProperty(propertyId);

    const occupiedSpots = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .filter((spot) => spot.state === ParkingSpotState.OCCUPIED);

    for (const spot of occupiedSpots) {
      if (spot.customer?.licensePlate?.includes('SIMULATION')) {
        await this.parkingService.freeSpot(propertyId, spot.id);
        await this.parkingService.leave(propertyId, {
          id: spot.customer.id,
          licensePlate: spot.customer.licensePlate,
        });
      }
    }
  }

  getSimulationStatus(propertyId: string) {
    return this.simulationIds.has(propertyId);
  }

  async runSimulation(propertyId: string) {
    if (this.config.get('FIRESTORE_DB') === 'prod') {
      this.logger.error('Simulation not allowed in production');
      return;
    }

    this.logger.log('Running simulation for: ' + propertyId);
    const parkingProperty = await this.fetchParkingProperty(propertyId);
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
      await this.simulateCarEntering(propertyId, freeSpots);
    } else {
      await this.simulateCarExiting(propertyId, occupiedSpots);
    }
  }

  private async simulateCarEntering(propertyId: string, freeSpots: any[]) {
    if (freeSpots.length === 0) {
      this.logger.warn('No free spots available');
      return;
    }

    const id = crypto.randomUUID();
    await this.parkingService.enter(propertyId, {
      id: id,
      licensePlate: 'SIMULATION',
    });

    const spot = freeSpots[0]; // Nimm den ersten freien Platz
    await this.parkingService.occupySpot(propertyId, spot.id, {
      id,
      licensePlate: 'SIMULATION',
    });

    if (spot.electricCharging) {
      setTimeout(async () => {
        await this.parkingService.chargeSpot(propertyId, spot.id);
      }, SIMULATION_INTERVAL / 5);
    }
  }

  private async simulateCarExiting(propertyId: string, occupiedSpots: any[]) {
    if (occupiedSpots.length === 0) {
      this.logger.warn('No occupied spots left');
      return;
    }

    const spot = occupiedSpots[0]; // Nimm den ersten belegten Platz
    await this.parkingService.freeSpot(propertyId, spot.id);

    setTimeout(async () => {
      const id = spot.customer.id;
      await this.parkingService.leave(propertyId, {
        id,
        licensePlate: 'SIMULATION',
      });
    }, SIMULATION_INTERVAL / 2);
  }

  private async fetchParkingProperty(
    parkingPropertyId: string,
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<IParkingProperty>(
          `${this.parkingPropertiesApi}/v1/parking-properties/${parkingPropertyId}`,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch parking property: ${error.message}`);
      throw new Error('Parking Property not found');
    }
  }
}
