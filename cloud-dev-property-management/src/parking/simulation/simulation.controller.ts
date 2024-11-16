import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SimulationService, SimulationState } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post(':propertyId/start')
  startSimulation(
    @Param('propertyId') propertyId: string,
    @Query('state') simulationState: SimulationState,
  ) {
    return this.simulationService.startSimulation(propertyId, simulationState);
  }

  @Post(':propertyId/stop')
  stopSimulation(@Param('propertyId') propertyId: string) {
    return this.simulationService.stopSimulation(propertyId);
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
