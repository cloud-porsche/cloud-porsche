import { PickType } from '@nestjs/mapped-types';
import { ParkingProperty } from '../entities/parking-property.entity';

export class CreateParkingPropertyDto extends PickType(ParkingProperty, [
  'name',
  'location',
  'description',
  'pricePerHour',
  'parkingType',
  'parkingSpots',
] as const) {}
