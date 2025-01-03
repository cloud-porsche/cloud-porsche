import { Controller, Get, Logger, Param, Post, Headers } from '@nestjs/common';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationController.name);

  constructor(private readonly simulationService: SimulationService) {}

  @Post(':propertyId/start')
  async startSimulation(@Headers('tenant-id') tenantId: string, @Param('propertyId') propertyId: string) {
    try {
      return await this.simulationService.startSimulation(tenantId, propertyId);
    } catch (error) {
      this.logger.error(
        'Error starting simulation - trying to stop simulation',
        error,
      );
      await this.simulationService.stopSimulation(tenantId, propertyId);
      return error;
    }
  }

  @Post(':propertyId/stop')
  async stopSimulation(@Headers('tenant-id') tenantId: string, @Param('propertyId') propertyId: string) {
    try {
      return await this.simulationService.stopSimulation(tenantId, propertyId);
    } catch (error) {
      this.logger.error('Error stopping simulation', error);
      return error;
    }
  }

  @Get(':propertyId/status')
  getSimulationStatus(@Param('propertyId') propertyId: string) {
    return this.simulationService.getSimulationStatus(propertyId);
  }
}
