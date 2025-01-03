import { Injectable } from '@nestjs/common';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Defect } from './entities/defect.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { ParkingProperty } from '../parking-properties/entities/parking-property.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class DefectsService {
  defectRepository: BaseFirestoreRepository<Defect> = getRepository(Defect);
  objectStorageService: ObjectStorageService;
  parkingPropertiesService: ParkingPropertiesService;

  constructor() {
    this.defectRepository = getRepository(Defect);
    this.objectStorageService = new ObjectStorageService();
    this.parkingPropertiesService = new ParkingPropertiesService(
      ParkingProperty,
    );
  }

  async create(createDefectDto: CreateDefectDto, tenantId: string) {
    const newDefect = await this.defectRepository.create(
      new Defect({ ...createDefectDto, tenantId }),
    );

    // Update the associated property's defectIds
    const property = await this.parkingPropertiesService.findOne(
      newDefect.propertyId,
    );
    if (property) {
      property.defects = [...(property.defects || []), newDefect.id];
      await this.parkingPropertiesService.update(property.id, {
        defects: property.defects,
      });
    }

    return newDefect;
  }

  async findAll(propertyId: string, tenantId: string) {
    return await this.defectRepository
      .whereEqualTo('propertyId', propertyId)
      .whereEqualTo('tenantId', tenantId)
      .find();
  }

  async findFiltered(search: string, filter: keyof Defect, propertyId: string, tenantId: string) {
    if (!search || !filter) return this.findAll(propertyId, tenantId);
    return await this.defectRepository
      .whereGreaterOrEqualThan(filter, search)
      .whereLessOrEqualThan(filter, search + '\uf8ff')
      .whereEqualTo('propertyId', propertyId)
      .whereEqualTo('tenantId', tenantId)
      .find();
  }

  async findOne(id: string) {
    return await this.defectRepository.findById(id);
  }

  async update(id: string, updateDefectDto: UpdateDefectDto) {
    return await this.defectRepository.update({
      id: id,
      lastModified: new Date(),
      ...updateDefectDto,
    } as Defect);
  }

  async remove(id: string) {
    const existingDefect = await this.findOne(id);
    if (!existingDefect) {
      throw new Error(`Defect with id ${id} not found.`);
    }

    // Remove defectId from the associated property's defectIds
    const property = await this.parkingPropertiesService.findOne(
      existingDefect.propertyId,
    );
    if (property) {
      property.defects = (property.defects || []).filter(
        (defectId) => defectId !== id,
      );
      await this.parkingPropertiesService.update(property.id, {
        defects: property.defects,
      });
    }

    // Delete the defect
    return await this.defectRepository.delete(id);
  }
}
