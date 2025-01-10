import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from '@cloud-porsche/types';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('parking-properties')
export class ParkingPropertiesController {
  constructor(
    private readonly parkingPropertiesService: ParkingPropertiesService,
    // TODO Fix SimulationService later
    //private readonly simulationService: SimulationService,
    //@Inject('SIMULATION_PARKING_PROPERTIES_SERVICE')
    private readonly simulationParkingPropertiesService: ParkingPropertiesService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  create(
    @Headers('tenant-id') tenantId: string,
    @Body() createParkingPropertyDto: CreateParkingPropertyDto,
  ) {
    return this.parkingPropertiesService.create(
      createParkingPropertyDto,
      tenantId,
    );
  }

  @Get()
  findAll(@Headers('tenant-id') tenantId: string) {
    return this.parkingPropertiesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // if (this.simulationService.getSimulationStatus(id)) {
    //   return this.simulationParkingPropertiesService.findOne(id);
    // }
    return this.parkingPropertiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() updateParkingPropertyDto: UpdateParkingPropertyDto,
  ) {
    return this.parkingPropertiesService.update(
      tenantId,
      id,
      updateParkingPropertyDto,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.parkingPropertiesService.remove(tenantId, id);
  }
}
