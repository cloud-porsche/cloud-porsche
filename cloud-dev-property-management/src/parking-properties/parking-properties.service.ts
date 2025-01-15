import { HttpException, Injectable } from '@nestjs/common';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
} from 'fireorm';
import { ParkingProperty } from './entities/parking-property.entity';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';
import { ITenant, TenantTier } from '@cloud-porsche/types';

@Injectable()
export class ParkingPropertiesService {
  private tenantDb = getFirestore(getApp('tenant'));
  parkingPropertyRepository: BaseFirestoreRepository<ParkingProperty>;

  constructor(repositoryClass: EntityConstructorOrPath<ParkingProperty>) {
    this.parkingPropertyRepository = getRepository(repositoryClass);
  }

  async create(createParkingPropertyDto: CreateParkingPropertyDto, tenantId: string) {
    const properties = await this.parkingPropertyRepository.whereEqualTo('tenantId', tenantId).find();
    const tenant = (
      await this.tenantDb.collection('Tenants').doc(tenantId).get()
    ).data() as ITenant;
    if (!tenant) {
      console.log("free tier tenant");
      console.log(createParkingPropertyDto.layers.some((layer) => 
        layer.parkingSpots.some((spot) => spot.placeholder)));
      console.log(createParkingPropertyDto.layers.length);
      console.log(properties.length);
      if(createParkingPropertyDto.layers.some((layer) => 
        layer.parkingSpots.some((spot) => spot.placeholder)) ||
        createParkingPropertyDto.layers.length > 1 ||
        properties.length > 0) {
        throw new HttpException('Not allowed as free tenant', 403);
      }
    } else if(tenant.tier === TenantTier.PRO) {
      if(properties.length > 4) {
        throw new HttpException('Not allowed as pro tenant', 403);
      }
    }
    const newProperty = new ParkingProperty({
      ...createParkingPropertyDto,
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
