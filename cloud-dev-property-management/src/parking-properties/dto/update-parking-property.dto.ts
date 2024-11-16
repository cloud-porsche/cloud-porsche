import { PartialType } from '@nestjs/swagger';
import { ParkingProperty } from '../entities/parking-property.entity';

export class UpdateParkingPropertyDto extends PartialType(ParkingProperty) {}
