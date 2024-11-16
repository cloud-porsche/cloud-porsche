import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefectsModule } from './defects/defects.module';
import { ConfigModule } from '@nestjs/config';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { ParkingPropertiesModule } from './parking-properties/parking-properties.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ParkingModule } from './parking/parking.module';
import { SimulationModule } from './parking/simulation/simulation.module';

@Module({
  imports: [
    DefectsModule,
    ObjectStorageModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production', '.env.development'],
    }),
    ParkingPropertiesModule,
    ParkingModule,
    SimulationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'v1', method: RequestMethod.GET },
        { path: 'api', method: RequestMethod.ALL },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
