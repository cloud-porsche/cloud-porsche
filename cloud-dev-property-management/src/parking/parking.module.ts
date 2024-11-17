import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { ParkingProperty } from '../parking-properties/entities/parking-property.entity';

@Module({
  controllers: [ParkingController],
  providers: [
    ParkingService,
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
  ],
})
export class ParkingModule {}
