import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParkingPropertiesService } from './parking-properties.service';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';

@Controller('parking-properties')
export class ParkingPropertiesController {
  constructor(
    private readonly parkingPropertiesService: ParkingPropertiesService,
  ) {}

  @Post()
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
    return this.parkingPropertiesService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.parkingPropertiesService.remove(tenantId, id);
  }
}
