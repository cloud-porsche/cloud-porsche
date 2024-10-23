import { Module } from '@nestjs/common';
import { DefectsService } from './defects.service';
import { DefectsController } from './defects.controller';

@Module({
  imports: [],
  controllers: [DefectsController],
  providers: [DefectsService],
})
export class DefectsModule {}
