import { Module, forwardRef } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { SimulationService } from './simulation/simulation.service';
import { SimulationController } from './simulation/simulation.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [forwardRef(() => ConfigModule), HttpModule],
  controllers: [ParkingController, SimulationController],
  providers: [ParkingService, SimulationService],
  exports: [SimulationService],
})
export class ParkingModule {}
