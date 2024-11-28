import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
