import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { SimulationParkingProperty } from './simulation/entities/parking-property.entity';

@Module({
  controllers: [ParkingController],
  providers: [
    ParkingService,
    {
      useFactory: () => {
        return new ParkingPropertiesService(SimulationParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
  ],
})
export class ParkingModule {}
