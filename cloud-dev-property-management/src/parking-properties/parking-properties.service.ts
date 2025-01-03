import { Injectable } from '@nestjs/common';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
} from 'fireorm';
import { ParkingProperty } from './entities/parking-property.entity';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';

export interface ParkingPropertySubscriber {
  changedParkingProperty(
    sender: ParkingPropertiesService,
    parkingProperty: ParkingProperty[],
  ): Promise<void>;
}

@Injectable()
export class ParkingPropertiesService {
  private listeners = [];

  parkingPropertyRepository: BaseFirestoreRepository<ParkingProperty>;

  constructor(repositoryClass: EntityConstructorOrPath<ParkingProperty>) {
    this.parkingPropertyRepository = getRepository(repositoryClass);
  }

  addListener(listener: any) {
    this.listeners.push(listener);
  }

  private async notify(tenantId: string) {
    for (const listener of this.listeners) {
      await listener.changedParkingProperty(this, await this.findAll(tenantId));
    }
  }

  async create(createDefectDto: CreateParkingPropertyDto, tenantId: string) {
    console.log('creating parking property');
    const newProperty = new ParkingProperty({
      ...createDefectDto,
      tenantId: tenantId,
    });
    const res = await this.parkingPropertyRepository.create(newProperty);
    await this.notify(tenantId);
    return res;
  }

  async findAll(tenantId: string) {
    if (!tenantId) {
      return await this.parkingPropertyRepository.find();
    }
    return await this.parkingPropertyRepository
      .whereEqualTo('tenantId', tenantId)
      .find();
  }

  async findOne(id: string) {
    return await this.parkingPropertyRepository.findById(id);
  }

  async update(
    tenantId: string,
    id: string,
    updateParkingPropertyDto: UpdateParkingPropertyDto,
  ) {
    const toUpdate = {
      id: id,
      lastModified: new Date(),
      ...updateParkingPropertyDto,
    };
    const res = await this.parkingPropertyRepository.update(
      toUpdate as ParkingProperty,
    );
    await this.notify(tenantId);
    return res;
  }

  async remove(tenantId: string, id: string) {
    console.log('removing parking property with id: ', id);
    const res = await this.parkingPropertyRepository.delete(id);
    await this.notify(tenantId);
    return res;
  }
}
