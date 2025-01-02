import { Controller, Get, Post, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('data')
  async getData(@Query('timeframe') timeframe: string) {
    return this.monitoringService.getAllData(timeframe);
  }
}
