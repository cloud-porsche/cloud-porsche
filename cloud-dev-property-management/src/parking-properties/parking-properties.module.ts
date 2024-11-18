import { Module } from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { ParkingPropertiesController } from './parking-properties.controller';
import { ParkingProperty } from './entities/parking-property.entity';
import { SimulationModule } from '../parking/simulation/simulation.module';
import { SimulationParkingProperty } from '../parking/simulation/entities/parking-property.entity';

@Module({
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
  ],
  imports: [SimulationModule],
})
export class ParkingPropertiesModule {}
