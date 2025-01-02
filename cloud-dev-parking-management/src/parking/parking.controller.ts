import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { Customer } from '@cloud-porsche/types';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  private readonly logger = new Logger(ParkingController.name);

  constructor(private readonly parkingService: ParkingService) {}

  @Post(':parkingPropertyId/enter')
  async enter(
    @Param('parkingPropertyId') parkingPropertyId: string,
    @Body() newCustomer: Customer,
  ) {
    try {
      return await this.parkingService.enter(parkingPropertyId, newCustomer);
    } catch (error) {
      this.logger.error('Error entering parking property', error);
      return error;
    }
  }

  @Post(':parkingPropertyId/leave')
  async leave(
    @Param('parkingPropertyId') parkingPropertyId: string,
    @Body() customer: Customer,
  ) {
    try {
      return await this.parkingService.leave(parkingPropertyId, customer);
    } catch (error) {
      this.logger.error('Error leaving parking property', error);
      return error;
    }
  }

  @Post(':parkingPropertyId/:spotId/occupy')
  async occupySpot(
    @Param('parkingPropertyId') parkingPropertyId: string,
    @Param('spotId') spotId: string,
    @Body() customer: Customer,
  ) {
    try {
      return await this.parkingService.occupySpot(
        parkingPropertyId,
        spotId,
        customer,
      );
    } catch (error) {
      this.logger.error('Error occupying parking spot', error);
      return error;
    }
  }

  @Post(':parkingPropertyId/:spotId/free')
  async freeSpot(
    @Param('parkingPropertyId') parkingPropertyId: string,
    @Param('spotId') spotId: string,
  ) {
    try {
      return await this.parkingService.freeSpot(parkingPropertyId, spotId);
    } catch (error) {
      this.logger.error('Error freeing parking spot', error);
      return error;
    }
  }
}
