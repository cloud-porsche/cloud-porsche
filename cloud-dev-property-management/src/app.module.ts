import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefectsModule } from './defects/defects.module';
import { ConfigModule } from '@nestjs/config';
import { ObjectStorageModule } from './object-storage/object-storage.module';

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
