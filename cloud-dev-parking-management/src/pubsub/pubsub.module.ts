import { Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service';

@Module({
  providers: [PubSubService],
  exports: [PubSubService], // Exporting the service so it can be used in other modules
})
export class PubSubModule {}
