import { Module, forwardRef } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { SimulationService } from './simulation/simulation.service';
import { SimulationController } from './simulation/simulation.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PubSubService } from 'src/pubsub/pubsub.service';

@Module({
  imports: [forwardRef(() => ConfigModule), HttpModule],
  controllers: [ParkingController, SimulationController],
  providers: [ParkingService, SimulationService, PubSubService],
  exports: [SimulationService],
})
export class ParkingModule {}
