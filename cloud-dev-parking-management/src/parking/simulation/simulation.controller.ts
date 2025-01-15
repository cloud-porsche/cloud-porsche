import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Headers,
  Body,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationSpeed } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationController.name);

  constructor(private readonly simulationService: SimulationService) {}

  @Post(':propertyId/start')
  async startSimulation(
    @Headers('tenant-id') tenantId: string,
    @Headers('authorization') token: string,
    @Param('propertyId') propertyId: string,
    @Body('speed') speed: string,
  ) {
    try {
      return await this.simulationService.startSimulation(
        token,
        tenantId,
        propertyId,
        speed,
      );
    } catch (error) {
      this.logger.error(
        'Error starting simulation - trying to stop simulation',
        error,
      );
      await this.simulationService.stopSimulation(token, tenantId, propertyId);
      return error;
    }
  }

  @Post(':propertyId/update-speed')
  async updateSimulationSpeed(
    @Headers('tenant-id') tenantId: string,
    @Headers('authorization') token: string,
    @Param('propertyId') propertyId: string,
    @Body('speed') speed: SimulationSpeed,
  ) {
    try {
      await this.simulationService.updateSimulationSpeed(propertyId, speed);
      return { message: `Simulation speed updated to ${speed}` };
    } catch (error) {
      this.logger.error('Error updating simulation speed', error);
      return { error: error.message };
    }
  }

  @Post(':propertyId/stop')
  async stopSimulation(
    @Headers('tenant-id') tenantId: string,
    @Headers('authorization') token: string,
    @Param('propertyId') propertyId: string,
  ) {
    try {
      return await this.simulationService.stopSimulation(
        token,
        tenantId,
        propertyId,
      );
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
