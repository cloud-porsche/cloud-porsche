import { PartialType } from '@nestjs/swagger';
import { ParkingSpot } from '@cloud-porsche/types';

export class UpdateParkingSpotDto extends PartialType(ParkingSpot) {}
