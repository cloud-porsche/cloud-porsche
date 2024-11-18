import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ParkingPropertiesService } from '../../parking-properties/parking-properties.service';
import { SimulationParkingProperty } from './entities/parking-property.entity';
import { ConfigModule } from '@nestjs/config';
import { ParkingService } from '../parking.service';
import { ParkingProperty } from '../../parking-properties/entities/parking-property.entity';

@Module({
  exports: [SimulationService],
  controllers: [SimulationController],
  providers: [
    SimulationService,
    {
      useFactory: () => {
        return new ParkingService(
          new ParkingPropertiesService(SimulationParkingProperty),
        );
      },
      provide: 'SIMULATION_PARKING_SERVICE',
    },
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: 'DEFAULT_PARKING_PROPERTIES_SERVICE',
    },
  ],
  imports: [ConfigModule],
})
export class SimulationModule {}
