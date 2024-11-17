import { Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { SimulationService, SimulationState } from './simulation.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationController.name);

  constructor(private readonly simulationService: SimulationService) {}

  @Post(':propertyId/start')
  @ApiQuery({
    name: 'state',
    type: typeof SimulationState,
    required: false,
  })
  async startSimulation(
    @Param('propertyId') propertyId: string,
    @Query('state') simulationState: SimulationState,
  ) {
    try {
      return await this.simulationService.startSimulation(
        propertyId,
        simulationState,
      );
    } catch (error) {
      this.logger.error(
        'Error starting simulation - trying to stop simulation',
        error,
      );
      await this.simulationService.stopSimulation(propertyId);
      return error;
    }
  }

  @Post(':propertyId/stop')
  async stopSimulation(@Param('propertyId') propertyId: string) {
    try {
      return await this.simulationService.stopSimulation(propertyId);
    } catch (error) {
      this.logger.error('Error stopping simulation', error);
      return error;
    }
  }

  @Get(':propertyId/status')
  getSimulationStatus(@Param('propertyId') propertyId: string) {
    return this.simulationService.getSimulationStatus(propertyId);
  }

  @Post(':propertyId/change')
  changeSimulationState(
    @Param('propertyId') propertyId: string,
    @Query('state') simulationState: SimulationState,
  ) {
    return this.simulationService.changeSimulationState(
      propertyId,
      simulationState,
    );
  }
}
