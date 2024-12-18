import { forwardRef, Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { ParkingPropertiesModule } from '../parking-properties/parking-properties.module';
import { SimulationService } from './simulation/simulation.service';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { SimulationController } from './simulation/simulation.controller';
import { ConfigModule } from '@nestjs/config';
import { PubSubService } from 'src/pubsub/pubsub.service';

@Module({
  exports: [SimulationService],
  controllers: [ParkingController, SimulationController],
  providers: [
    ParkingService,
    SimulationService,
    PubSubService,
    {
      useFactory: (p: ParkingPropertiesService, pubSub: PubSubService) => {
        return new ParkingService(p, pubSub);
      },
      inject: [
        { token: 'SIMULATION_PARKING_PROPERTIES_SERVICE', optional: false },
      ],
      provide: 'SIMULATION_PARKING_SERVICE',
    },
  ],
  imports: [forwardRef(() => ParkingPropertiesModule), ConfigModule],
})
export class ParkingModule {}
