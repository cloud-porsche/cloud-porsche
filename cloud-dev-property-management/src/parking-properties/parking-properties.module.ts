import { Module } from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { ParkingPropertiesController } from './parking-properties.controller';
import { ParkingProperty } from './entities/parking-property.entity';
import { ParkingPropertiesGateway } from './parking-properties.gateway';

@Module({
  exports: [ParkingPropertiesService], // 👈 Export 'SIMULATION_PARKING_PROPERTIES_SERVICE'
  controllers: [ParkingPropertiesController],
  providers: [
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
    ParkingPropertiesGateway,
  ],
})
export class ParkingPropertiesModule {}
