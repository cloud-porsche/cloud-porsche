import { Module } from '@nestjs/common';
import { ObjectStorageService } from './object_storage.service';
import { ObjectStorageController } from './object_storage.controller';

@Module({
  imports: [],
  controllers: [ObjectStorageController],
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}