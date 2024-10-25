import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefectsModule } from './defects/defects.module';
import { ObjectStorageModule } from './object_storage/object_storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DefectsModule,
    ObjectStorageModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production', '.env.development'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
