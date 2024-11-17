import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ParkingService } from '../parking.service';
import { ConfigService } from '@nestjs/config';
import { ParkingSpotState } from '@cloud-porsche/types';
import { ParkingPropertiesService } from '../../parking-properties/parking-properties.service';

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
    private readonly parkingPropertyService: ParkingPropertiesService,
  ) {}

  async startSimulation(propertyId: string, simulationState?: SimulationState) {
    if (this.simulationIds.has(propertyId)) {
      this.logger.error('Simulation already running');
      return;
    }
    // copy real data over to simulation
    const existingProperty =
      await this.parkingPropertyService.findOne(propertyId);
    const previousSimData =
      this.parkingService.parkingPropertiesService.findOne(propertyId);
    if (previousSimData)
      await this.parkingService.parkingPropertiesService.remove(propertyId);
    await this.parkingService.parkingPropertiesService.create(existingProperty);

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
    // delete simulation data
    await this.parkingService.parkingPropertiesService.remove(propertyId);

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
        const parkingProperty =
          await this.parkingService.parkingPropertiesService.findOne(
            propertyId,
          );
        const spot = parkingProperty.parkingSpots.find(
          (s) => s.state === ParkingSpotState.FREE,
        );
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
      }, SIMULATION_INTERVAL / 2);
    } else if (state === SimulationState.EXITING) {
      const parkingProperty =
        await this.parkingService.parkingPropertiesService.findOne(propertyId);
      const spot = parkingProperty.parkingSpots.find(
        (s) => s.state === ParkingSpotState.OCCUPIED,
      );
      if (!spot) {
        this.logger.warn('No occupied spots left - changing state to ENTERING');
        this.changeSimulationState(propertyId, SimulationState.ENTERING);
        return;
      }
      await this.parkingService.freeSpot(propertyId, spot.id);

      setTimeout(async () => {
        const id = spot.customer.id;
        await this.parkingService.leave(propertyId, {
          id,
          licensePlate: 'DOESNTMATTER',
        });
      }, SIMULATION_INTERVAL / 2);
    }
  }
}
