import { Controller, Get, Post } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('test')
  test(): Promise<string> {
    return this.monitoringService.test();
  }
}
