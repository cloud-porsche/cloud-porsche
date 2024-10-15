import { Injectable } from '@nestjs/common';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Defect } from './entities/defect.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private defectRepository: Repository<Defect>,
  ) {}

  create(createDefectDto: CreateDefectDto) {
    return this.defectRepository.save(new Defect(createDefectDto));
  }

  findAll() {
    return this.defectRepository.find();
  }

  async findFiltered(search: string, filter: string) {
    const query = this.defectRepository.createQueryBuilder('defect');
  
    if (filter === 'reportedDate') {
      console.log('test')
      query.where(`strftime('%d.%m.%Y', defect.${filter}) LIKE :search`, { search: `%${search}%` });
    } else {
      query.where(`defect.${filter} LIKE :search`, { search: `%${search}%` });
    }
    return await query.getMany();
  }

  findOne(id: number) {
    return this.defectRepository.findOneBy({ id });
  }

  update(id: number, updateDefectDto: UpdateDefectDto) {
    return this.defectRepository.update(id, updateDefectDto);
  }

  remove(id: number) {
    return this.defectRepository.delete(id);
  }
}
