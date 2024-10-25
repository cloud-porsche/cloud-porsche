import { Module } from '@nestjs/common';
import { DefectsService } from './defects.service';
import { DefectsController } from './defects.controller';
import { ObjectStorageService } from 'src/object_storage/object_storage.service';

@Module({
  imports: [ObjectStorageService],
  controllers: [DefectsController],
  providers: [DefectsService],
})
export class DefectsModule {}
