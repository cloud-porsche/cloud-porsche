import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DefectsService } from './defects.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { Defect } from './entities/defect.entity';
import { UpdateDefectDto } from './dto/update-defect.dto';

@Controller('defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  async create(@Body() createDefectDto: CreateDefectDto) {
    return await this.defectsService.create(createDefectDto);
  }

  @Get()
  async findAll() {
    return await this.defectsService.findAll();
  }

  @Get('search')
  async findBySearchAndFilter(
    @Query('search') search: string,
    @Query('filter') filter: keyof Defect,
  ) {
    return await this.defectsService.findFiltered(search, filter);
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
  async remove(@Param('id') id: string) {
    return await this.defectsService.remove(id);
  }
}
