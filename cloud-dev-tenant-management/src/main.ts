import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  require('dotenv').config();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      app.get(ConfigService).get('CORS_ORIGIN', '*'),
      ...app.get(ConfigService).get('CORS_ORIGINS', '').split(','),
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(json({ limit: '15mb' }));

  const config = new DocumentBuilder()
    .setTitle('Cloud Porsche Tenant Management API')
    .setDescription('The tenant management API for Cloud Porsche at HTWG')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    yamlDocumentUrl: 'swagger/yml',
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
