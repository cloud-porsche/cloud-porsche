import { Collection } from 'fireorm';
import { ParkingProperty } from '../../../parking-properties/entities/parking-property.entity';

@Collection()
export class SimulationParkingProperty extends ParkingProperty {}
