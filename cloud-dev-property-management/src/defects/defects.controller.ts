import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { DefectsService } from './defects.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { Defect } from './entities/defect.entity';
import { UpdateDefectDto } from './dto/update-defect.dto';

@Controller('defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  async create(
    @Headers('tenant-id') tenantId: string,
    @Body() createDefectDto: CreateDefectDto,
  ) {
    return await this.defectsService.create(createDefectDto, tenantId);
  }

  @Get()
  async findAll(
    @Headers('tenant-id') tenantId: string,
    @Query('propertyId') propertyId?: string,
  ) {
    if (propertyId) {
      return await this.defectsService.findAll(propertyId, tenantId);
    }
  }

  @Get('search')
  async findBySearchAndFilter(
    @Headers('tenant-id') tenantId: string,
    @Query('search') search: string,
    @Query('filter') filter: keyof Defect,
    @Query('propertyId') propertyId?: string,
  ) {
    return await this.defectsService.findFiltered(
      search,
      filter,
      propertyId,
      tenantId,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.defectsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateDefectDto: UpdateDefectDto,
  ) {
    return await this.defectsService.update(id, updateDefectDto);
  }

  @Delete(':id')
  async remove(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return await this.defectsService.remove(tenantId, id);
  }
}
