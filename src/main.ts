import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express'; // Import express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Access the underlying Express app
  const expressApp = app.getHttpAdapter().getInstance();

  // Set 'trust proxy' to 1
  expressApp.set('trust proxy', 1);

  // Enable CORS
  app.enableCors({
    origin: configService.get('frontendURL'),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Use cookie parser
  app.use(cookieParser());

  // If you need to add express.json() middleware
  app.use(express.json()); // Add this line if necessary

  const port = configService.get('PORT');
  await app.listen(port);
}

bootstrap();
