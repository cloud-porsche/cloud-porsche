import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { ParkingModule } from './parking/parking.module';
import { LoggingMiddleware } from './pubsub/logging.middleware';
import { PubSubModule } from './pubsub/pubsub.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { SimulationService } from './parking/simulation/simulation.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production', '.env.development'],
    }),
    ParkingModule,
    PubSubModule,
    GracefulShutdownModule.forRoot({
      cleanup: async (app, signal) => {
        const simService = app.get(SimulationService);
        await simService.stopAllSimulation();

        console.info(
          `Cleanup on ${signal} - sims still running: ${simService.simIsRunning.size}`,
        );
      },
      gracefulShutdownTimeout: 30000,
      keepNodeProcessAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggingMiddleware)
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
