import { Injectable } from '@nestjs/common';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
} from 'fireorm';
import { ParkingProperty } from './entities/parking-property.entity';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';

@Injectable()
export class ParkingPropertiesService {
  parkingPropertyRepository: BaseFirestoreRepository<ParkingProperty>;

  constructor(repositoryClass: EntityConstructorOrPath<ParkingProperty>) {
    this.parkingPropertyRepository = getRepository(repositoryClass);
  }

  async create(createDefectDto: CreateParkingPropertyDto) {
    return await this.parkingPropertyRepository.create(
      new ParkingProperty(createDefectDto),
    );
  }

  async findAll() {
    return await this.parkingPropertyRepository.find();
  }

  async findOne(id: string) {
    return await this.parkingPropertyRepository.findById(id);
  }

  async update(id: string, updateParkingPropertyDto: UpdateParkingPropertyDto) {
    return await this.parkingPropertyRepository.update({
      id: id,
      lastModified: new Date(),
      ...updateParkingPropertyDto,
    } as ParkingProperty);
  }

  async remove(id: string) {
    return await this.parkingPropertyRepository.delete(id);
  }
}
