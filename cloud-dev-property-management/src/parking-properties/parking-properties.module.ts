import { forwardRef, Module } from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { ParkingPropertiesController } from './parking-properties.controller';
import { ParkingProperty } from './entities/parking-property.entity';
import { SimulationParkingProperty } from '../parking/simulation/entities/parking-property.entity';
import { ParkingPropertiesGateway } from './parking-properties.gateway';
import { ParkingModule } from '../parking/parking.module';

@Module({
  exports: [ParkingPropertiesService, 'SIMULATION_PARKING_PROPERTIES_SERVICE'],
  controllers: [ParkingPropertiesController],
  providers: [
    {
      useFactory: () => {
        return new ParkingPropertiesService(ParkingProperty);
      },
      provide: ParkingPropertiesService,
    },
    {
      useFactory: () => {
        return new ParkingPropertiesService(SimulationParkingProperty);
      },
      provide: 'SIMULATION_PARKING_PROPERTIES_SERVICE',
    },
    ParkingPropertiesGateway,
  ],
  imports: [forwardRef(() => ParkingModule)],
})
export class ParkingPropertiesModule {}
