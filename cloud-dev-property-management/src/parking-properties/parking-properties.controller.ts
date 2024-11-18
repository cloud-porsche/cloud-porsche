import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import { SimulationService } from '../parking/simulation/simulation.service';

@Controller('parking-properties')
export class ParkingPropertiesController {
  constructor(
    private readonly parkingPropertiesService: ParkingPropertiesService,
    private readonly simulationService: SimulationService,
    @Inject('SIMULATION_PARKING_PROPERTIES_SERVICE')
    private readonly simulationParkingPropertiesService: ParkingPropertiesService,
  ) {}

  @Post()
  create(@Body() createParkingPropertyDto: CreateParkingPropertyDto) {
    return this.parkingPropertiesService.create(createParkingPropertyDto);
  }

  @Get()
  findAll() {
    return this.parkingPropertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (this.simulationService.getSimulationStatus(id)) {
      return this.simulationParkingPropertiesService.findOne(id);
    }
    return this.parkingPropertiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParkingPropertyDto: UpdateParkingPropertyDto,
  ) {
    return this.parkingPropertiesService.update(id, updateParkingPropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingPropertiesService.remove(id);
  }
}
