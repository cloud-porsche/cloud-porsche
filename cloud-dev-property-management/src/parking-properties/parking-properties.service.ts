import { Injectable } from '@nestjs/common';
import { UpdateParkingPropertyDto } from './dto/update-parking-property.dto';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
} from 'fireorm';
import { ParkingProperty } from './entities/parking-property.entity';
import { CreateParkingPropertyDto } from './dto/create-parking-property.dto';
import { Customer, ParkingSpot } from '@cloud-porsche/types';

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

  private async notify() {
    for (const listener of this.listeners) {
      await listener.changedParkingProperty(this, await this.findAll());
    }
  }

  async create(createDefectDto: CreateParkingPropertyDto) {
    if ('parkingSpots' in createDefectDto)
      this.fillInSpotDefaults(
        createDefectDto as Pick<ParkingProperty, 'parkingSpots'>,
      );
    if ('customers' in createDefectDto)
      this.fillInCustomerDefaults(
        createDefectDto as Pick<ParkingProperty, 'customers'>,
      );
    const newProperty = new ParkingProperty(createDefectDto);
    const res = await this.parkingPropertyRepository.create(newProperty);
    await this.notify();
    return res;
  }

  async findAll() {
    return await this.parkingPropertyRepository.find();
  }

  async findOne(id: string) {
    return await this.parkingPropertyRepository.findById(id);
  }

  async update(id: string, updateParkingPropertyDto: UpdateParkingPropertyDto) {
    if ('parkingSpots' in updateParkingPropertyDto)
      this.fillInSpotDefaults(
        updateParkingPropertyDto as Pick<ParkingProperty, 'parkingSpots'>,
      );
    if ('customers' in updateParkingPropertyDto)
      this.fillInCustomerDefaults(
        updateParkingPropertyDto as Pick<ParkingProperty, 'customers'>,
      );
    const toUpdate = {
      id: id,
      lastModified: new Date(),
      ...updateParkingPropertyDto,
    } as ParkingProperty;
    const res = await this.parkingPropertyRepository.update(toUpdate);
    await this.notify();
    return res;
  }

  async remove(id: string) {
    const res = await this.parkingPropertyRepository.delete(id);
    await this.notify();
    return res;
  }

  private fillInSpotDefaults(
    parkingProperty: Pick<ParkingProperty, 'parkingSpots'>,
  ) {
    parkingProperty.parkingSpots = parkingProperty.parkingSpots.map((spot) => {
      return { ...new ParkingSpot(spot) };
    });
  }

  private fillInCustomerDefaults(
    parkingProperty: Pick<ParkingProperty, 'customers'>,
  ) {
    parkingProperty.customers = parkingProperty.customers.map((customer) => {
      return { ...new Customer(customer) };
    });
  }
}
