import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { initialize } from 'fireorm';
import { json, urlencoded } from 'express';

async function bootstrap() {
  require('dotenv').config();
  admin.initializeApp({
    credential:
      process.env.FIREBASE_OVERWRITE_CREDENTIALS === 'true'
        ? admin.credential.cert(
            process.env.FIREBASE_CLIENT_EMAIL
              ? {
                  projectId: process.env.FIREBASE_PROJECT_ID,
                  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                  privateKey: process.env.FIREBASE_PRIVATE_KEY.split(
                    String.raw`\n`,
                  ).join('\n'),
                }
              : require('cloud-porsche.json'),
          )
        : admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  admin.initializeApp({
    credential:
      process.env.FIREBASE_OVERWRITE_CREDENTIALS === 'true'
        ? admin.credential.cert(
            process.env.FIREBASE_CLIENT_EMAIL
              ? {
                  projectId: process.env.FIREBASE_PROJECT_ID,
                  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                  privateKey: process.env.FIREBASE_PRIVATE_KEY.split(
                    String.raw`\n`,
                  ).join('\n'),
                }
              : require('cloud-porsche.json'),
          )
        : admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }, 'tenant');

  const firestore = admin.firestore();
  firestore.settings({
    databaseId: process.env.FIRESTORE_DB,
    ignoreUndefinedProperties: true,
  });
  initialize(firestore);

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
  app.use(urlencoded({ extended: true, limit: '15mb' }));

  const config = new DocumentBuilder()
    .setTitle('Cloud Porsche Property Management API')
    .setDescription('The property management API for Cloud Porsche at HTWG')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    yamlDocumentUrl: 'swagger/yml',
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(app.get(ConfigService).get('PORT', 3000));
}

bootstrap();
