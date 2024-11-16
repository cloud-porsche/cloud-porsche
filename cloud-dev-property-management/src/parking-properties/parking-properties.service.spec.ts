import { Test, TestingModule } from '@nestjs/testing';
import { ParkingPropertiesService } from './parking-properties.service';

describe('ParkingPropertiesService', () => {
  let service: ParkingPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingPropertiesService],
    }).compile();

    service = module.get<ParkingPropertiesService>(ParkingPropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
