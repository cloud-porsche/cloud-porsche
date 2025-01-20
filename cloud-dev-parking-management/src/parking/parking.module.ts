import { Module, forwardRef } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { SimulationService } from './simulation/simulation.service';
import { SimulationController } from './simulation/simulation.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PubSubService } from 'src/pubsub/pubsub.service';
import { ParkingProperty } from './entities/parking-property.entity';

@Module({
  imports: [forwardRef(() => ConfigModule), HttpModule],
  controllers: [ParkingController, SimulationController],
  providers: [ParkingService, SimulationService, PubSubService,
    {
      useFactory: (...args) => {
        return new ParkingService(args[0], args[1], args[2], ParkingProperty);
      },
      provide: ParkingService,
      inject: [HttpService, ConfigService, PubSubService],
    },
  ],
  exports: [SimulationService],
})
export class ParkingModule {}
