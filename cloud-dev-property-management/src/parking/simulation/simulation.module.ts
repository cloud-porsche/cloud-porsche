import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ParkingPropertiesService } from '../../parking-properties/parking-properties.service';
import { SimulationParkingProperty } from './entities/parking-property.entity';
import { ConfigModule } from '@nestjs/config';
import { ParkingService } from '../parking.service';
import { ParkingProperty } from '../../parking-properties/entities/parking-property.entity';

@Module({
  controllers: [SimulationController],
  providers: [
    SimulationService,
    {
      useFactory: () => {
        return new ParkingService(
          new ParkingPropertiesService(SimulationParkingProperty),
        );
      },
      provide: ParkingService,
    },
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
  ],
  imports: [ConfigModule],
})
export class SimulationModule {}
