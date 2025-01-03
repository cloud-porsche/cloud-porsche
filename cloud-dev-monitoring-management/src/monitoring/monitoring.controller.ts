import { Controller, Get, Headers, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('data')
  async getData(@Headers('tenant-id') tenantId: string, @Query('timeframe') timeframe: string) {
    return this.monitoringService.getAllData(tenantId, timeframe);
  }
}
