import { Controller, Get, Post, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('customers')
  async getCustomerData(@Query('timeframe') timeframe: string) {
    return this.monitoringService.getCustomerData(timeframe);
  }

  @Get('customers/property-distribution')
  async getCustomerPropertyDistribution(@Query('timeframe') timeframe: string) {
    return this.monitoringService.getCustomerDistribution(timeframe);
  }

  @Get('data')
  async getData(@Query('timeframe') timeframe: string) {
    return this.monitoringService.getAllData(timeframe);
  }
}
