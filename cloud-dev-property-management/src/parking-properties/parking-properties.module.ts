import { Module } from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { ParkingPropertiesController } from './parking-properties.controller';
import { ParkingProperty } from './entities/parking-property.entity';

@Module({
  controllers: [ParkingPropertiesController],
  providers: [
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
  ],
})
export class ParkingPropertiesModule {}
