import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import { ParkingSpotState } from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';

export enum SimulationState {
  ENTERING,
  EXITING,
}

const SIMULATION_INTERVAL = 10000;

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  private simulationIds = new Map<string, SimulationState>();

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly parkingService: ParkingService,
    private readonly httpService: HttpService,
  ) {}

  async startSimulation(propertyId: string, simulationState?: SimulationState) {
    if (this.simulationIds.has(propertyId)) {
      this.logger.error('Simulation already running');
      return;
    }

    // Kopiere echte Daten über die API
    const existingProperty = await this.findParkingProperty(propertyId);

    // Entferne vorherige Simulationsdaten (falls vorhanden)
    await this.deleteParkingProperty(propertyId);

    // Erstelle Simulationsdaten basierend auf echten Daten
    await this.createParkingProperty(existingProperty);

    this.simulationIds.set(
      propertyId,
      simulationState ?? SimulationState.ENTERING,
    );
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
    // Lösche Simulationsdaten
    await this.deleteParkingProperty(propertyId);

    this.simulationIds.delete(propertyId);
    this.schedulerRegistry.deleteInterval('simulation');
    this.logger.log('Simulation stopped for: ' + propertyId);
  }

  getSimulationStatus(propertyId: string) {
    return this.simulationIds.has(propertyId);
  }

  changeSimulationState(propertyId: string, simulationState: SimulationState) {
    if (!this.simulationIds.has(propertyId))
      throw new Error('Simulation not running');
    this.simulationIds.set(propertyId, simulationState);
  }

  async runSimulation(propertyId: string) {
    if (this.config.get('FIRESTORE_DB') === 'prod') {
      this.logger.error('Simulation not allowed in production');
      return;
    }
    this.logger.log('Running simulation for: ' + propertyId);
    const state = this.simulationIds.get(propertyId);

    if (state === SimulationState.ENTERING) {
      const id = crypto.randomUUID();
      await this.parkingService.enter(propertyId, {
        id: id,
        licensePlate: 'SIMULATION',
      });

      setTimeout(async () => {
        if (!this.getSimulationStatus(propertyId)) return;
        const parkingProperty = await this.findParkingProperty(propertyId);
        const spot = parkingProperty.layers
          .flatMap((l) => l.parkingSpots)
          .find((s) => s.state === ParkingSpotState.FREE);
        if (!spot) {
          this.logger.warn(
            'No free spots available - changing state to EXITING',
          );
          this.changeSimulationState(propertyId, SimulationState.EXITING);
          return;
        }
        await this.parkingService.occupySpot(propertyId, spot.id, {
          id,
          licensePlate: 'SIMULATION',
        });
        if (spot.electricCharging) {
          setTimeout(async () => {
            await this.parkingService.chargeSpot(propertyId, spot.id);
          }, SIMULATION_INTERVAL / 5);
        }
      }, SIMULATION_INTERVAL / 2);
    } else if (state === SimulationState.EXITING) {
      const parkingProperty = await this.findParkingProperty(propertyId);
      const spot = parkingProperty.layers
        .flatMap((l) => l.parkingSpots)
        .find((s) => s.state === ParkingSpotState.OCCUPIED);
      if (!spot) {
        this.logger.warn('No occupied spots left - changing state to ENTERING');
        this.changeSimulationState(propertyId, SimulationState.ENTERING);
        return;
      }
      await this.parkingService.freeSpot(propertyId, spot.id);

      setTimeout(async () => {
        if (!this.getSimulationStatus(propertyId)) return;
        const id = spot.customer.id;
        await this.parkingService.leave(propertyId, {
          id,
          licensePlate: 'DOESNTMATTER',
        });
      }, SIMULATION_INTERVAL / 2);
    }
  }

  private async findParkingProperty(propertyId: string) {
    const response = this.httpService.get(
      `${this.config.get('PARKING_PROPERTIES_API_URL')}/properties/${propertyId}`,
    );
    return lastValueFrom(response).then((res) => res.data);
  }

  private async deleteParkingProperty(propertyId: string) {
    const response = this.httpService.delete(
      `${this.config.get('PARKING_PROPERTIES_API_URL')}/properties/${propertyId}`,
    );
    return lastValueFrom(response);
  }

  private async createParkingProperty(property: any) {
    const response = this.httpService.post(
      `${this.config.get('PARKING_PROPERTIES_API_URL')}/properties`,
      property,
    );
    return lastValueFrom(response);
  }
}
