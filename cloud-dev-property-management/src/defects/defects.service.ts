import { Injectable } from '@nestjs/common';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { Defect } from './entities/defect.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { ParkingProperty } from '../parking-properties/entities/parking-property.entity';
import { PubSubService } from 'src/pubsub/pubsub.service';

@Injectable()
export class DefectsService {
  defectRepository: BaseFirestoreRepository<Defect> = getRepository(Defect);
  objectStorageService: ObjectStorageService;
  parkingPropertiesService: ParkingPropertiesService;
  pubSubService: PubSubService;

  constructor() {
    this.defectRepository = getRepository(Defect);
    this.objectStorageService = new ObjectStorageService();
    this.parkingPropertiesService = new ParkingPropertiesService(
      ParkingProperty,
    );
    this.pubSubService = new PubSubService();
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
      await this.parkingPropertiesService.update(tenantId, property.id, {
        defects: property.defects,
      });
    }
    this.pubSubService.publishMessage({
      messageType: 'defect',
      tenantId: tenantId,
      action: 'create',
      propertyId: newDefect.propertyId,
      propertyName: property.name,
      defectId: newDefect.id,
      defectState: newDefect.status,
      date: new Date(),
    })
    return newDefect;
  }

  async findAll(propertyId: string, tenantId: string) {
    return await this.defectRepository
      .whereEqualTo('propertyId', propertyId)
      .whereEqualTo('tenantId', tenantId)
      .find();
  }

  async findFiltered(
    search: string,
    filter: keyof Defect,
    propertyId: string,
    tenantId: string,
  ) {
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

  async update(id: string, updateDefectDto: UpdateDefectDto, tenantId: string) {
    await this.defectRepository.update({
      id: id,
      lastModified: new Date(),
      ...updateDefectDto,
    } as Defect);
    const updatedDefect = await this.findOne(id);
    const property = await this.parkingPropertiesService.findOne(
      updatedDefect.propertyId,
    );
    this.pubSubService.publishMessage({
      messageType: 'defect',
      tenantId: tenantId,
      action: 'update',
      propertyId: updatedDefect.propertyId,
      propertyName: property.name,
      defectId: updatedDefect.id,
      defectState: updatedDefect.status,
      date: new Date(),
    })
  }

  async remove(tenantId: string, id: string) {
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
      await this.parkingPropertiesService.update(tenantId, property.id, {
        defects: property.defects,
      });
    }

    this.pubSubService.publishMessage({
      messageType: 'defect',
      tenantId: tenantId,
      action: 'delete',
      propertyId: existingDefect.propertyId,
      propertyName: property.name,
      defectId: existingDefect.id,
      defectState: existingDefect.status,
      date: new Date(),
    })
    return await this.defectRepository.delete(id);
  }
}
