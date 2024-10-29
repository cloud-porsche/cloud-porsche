import { Module } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.service';
import { ObjectStorageController } from './object-storage.controller';

@Module({
  imports: [],
  controllers: [ObjectStorageController],
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
