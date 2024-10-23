import { Injectable } from '@nestjs/common';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Defect } from './entities/defect.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';

@Injectable()
export class DefectsService {
  defectRepository: BaseFirestoreRepository<Defect> = getRepository(Defect);

  constructor() {
    this.defectRepository = getRepository(Defect);
  }

  async create(createDefectDto: CreateDefectDto) {
    return await this.defectRepository.create(new Defect(createDefectDto));
  }

  async findAll() {
    return await this.defectRepository.find();
  }

  async findFiltered(search: string, filter: keyof Defect) {
    return await this.defectRepository.whereEqualTo(filter, search).find();
  }

  async findOne(id: string) {
    return await this.defectRepository.findById(id);
  }

  async update(id: string, updateDefectDto: UpdateDefectDto) {
    return await this.defectRepository.update({
      id: id,
      ...updateDefectDto,
    } as Defect);
  }

  async remove(id: string) {
    return await this.defectRepository.delete(id);
  }
}
