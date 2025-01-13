import { Injectable } from '@nestjs/common';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
} from 'fireorm';
import { ParkingProperty } from './entities/parking-property.entity';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';

@Injectable()
export class ParkingPropertiesService {
  parkingPropertyRepository: BaseFirestoreRepository<ParkingProperty>;

  constructor(repositoryClass: EntityConstructorOrPath<ParkingProperty>) {
    this.parkingPropertyRepository = getRepository(repositoryClass);
  }

  async create(createDefectDto: CreateParkingPropertyDto, tenantId: string) {
    const newProperty = new ParkingProperty({
      ...createDefectDto,
      tenantId: tenantId,
    });
    return await this.parkingPropertyRepository.create(newProperty);
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
    _: string,
    id: string,
    updateParkingPropertyDto: UpdateParkingPropertyDto,
  ) {
    const toUpdate = {
      id: id,
      lastModified: new Date(),
      ...updateParkingPropertyDto,
    };
    return await this.parkingPropertyRepository.update(
      toUpdate as ParkingProperty,
    );
  }

  async remove(_: string, id: string) {
    return await this.parkingPropertyRepository.delete(id);
  }

  async updateSpot(
    tenantId: string,
    id: string,
    spotId: string,
    updateParkingSpotDto: UpdateParkingSpotDto,
  ) {
    const doc = await this.parkingPropertyRepository.findById(id);
    if (!doc || doc.tenantId !== tenantId) {
      return null;
    }
    const layer = doc.layers.find((l) =>
      l.parkingSpots.find((s) => s.id === spotId),
    );
    if (!layer) {
      return null;
    }
    const spot = layer.parkingSpots.find((s) => s.id === spotId);
    if (!spot) {
      return null;
    }
    Object.assign(spot, updateParkingSpotDto);
    spot.lastStateChange = new Date();
    return await this.parkingPropertyRepository.update(doc);
  }
}
