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
  UseGuards,
} from '@nestjs/common';
import { DefectsService } from './defects.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { Defect } from './entities/defect.entity';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from '@cloud-porsche/types';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
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
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  async update(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body()
    updateDefectDto: UpdateDefectDto,
  ) {
    return await this.defectsService.update(id, updateDefectDto, tenantId);
  }

  @Delete('clearAllDone')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  async clearAllDone(
      @Headers('tenant-id') tenantId: string,
      @Query('propertyId') propertyId: string,
    ) {
    return await this.defectsService.clearDoneDefects(tenantId, propertyId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  async remove(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return await this.defectsService.remove(tenantId, id);
  }
}
