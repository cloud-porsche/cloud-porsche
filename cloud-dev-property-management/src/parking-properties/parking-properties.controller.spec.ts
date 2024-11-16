import { Test, TestingModule } from '@nestjs/testing';
import { ParkingPropertiesController } from './parking-properties.controller';
import { ParkingPropertiesService } from './parking-properties.service';

describe('ParkingPropertiesController', () => {
  let controller: ParkingPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingPropertiesController],
      providers: [ParkingPropertiesService],
    }).compile();

    controller = module.get<ParkingPropertiesController>(ParkingPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
