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
import { UpdateDefectDto } from './dto/update-defect.dto';

@Controller('defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  create(@Body() createDefectDto: CreateDefectDto) {
    return this.defectsService.create(createDefectDto);
  }

  @Get()
  findAll() {
    return this.defectsService.findAll();
  }

  @Get('search')
  findBySearchAndFilter(
    @Query('search') search: string,
    @Query('filter') filter: string,
  ) {
    return this.defectsService.findFiltered(search, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.defectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDefectDto: UpdateDefectDto) {
    return this.defectsService.update(id, updateDefectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.defectsService.remove(id);
  }
}
