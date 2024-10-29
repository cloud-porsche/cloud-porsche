import { Injectable } from '@nestjs/common';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Defect } from './entities/defect.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ObjectStorageService } from 'src/object_storage/object_storage.service';

@Injectable()
export class DefectsService {
  defectRepository: BaseFirestoreRepository<Defect> = getRepository(Defect);
  objectStorageService: ObjectStorageService;

  constructor() {
    this.defectRepository = getRepository(Defect);
    this.objectStorageService = new ObjectStorageService();
  }

  async create(createDefectDto: CreateDefectDto) {
    return await this.defectRepository.create(new Defect(createDefectDto));
  }

  async findAll() {
    return await this.defectRepository.find();
  }

  async findFiltered(search: string, filter: keyof Defect) {
    if (!search || !filter) return this.findAll();
    return await this.defectRepository
      .whereGreaterOrEqualThan(filter, search)
      .whereLessOrEqualThan(filter, search + '\uf8ff')
      .find();
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
