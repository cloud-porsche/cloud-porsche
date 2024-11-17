import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ParkingPropertiesService } from '../../parking-properties/parking-properties.service';
import { SimulationParkingProperty } from './entities/parking-property.entity';
import { ConfigModule } from '@nestjs/config';
import { ParkingService } from '../parking.service';

@Module({
  controllers: [SimulationController],
  providers: [
    SimulationService,
    {
      useFactory: () => {
        return new ParkingService(
          new ParkingPropertiesService(SimulationParkingProperty), // FIXME: Now we cannot access the actual parking property ids
        );
      },
      provide: ParkingService,
    },
  ],
  imports: [ConfigModule],
})
export class SimulationModule {}
