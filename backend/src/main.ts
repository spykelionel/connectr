import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { ResponseTemplateInterceptor } from './core/interceptors/response-template/response-template.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow frontend origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma',
      ],
      credentials: true, // Allow credentials for authentication
    },
    logger: ['error', 'warn', 'log'],
    bodyParser: false, // Disable default body parser to configure manually
  });

  // Configure body parser for larger payloads
  app.use(json({ limit: '50mb' })); // Increase JSON payload limit
  app.use(urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded payload limit

  app.useGlobalInterceptors(app.get(ResponseTemplateInterceptor));
  // version and prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  // setup swagger docs
  const swagConfig = new DocumentBuilder()
    .setTitle('CircusPrime API')
    .setDescription('CircusPrime - Social Network Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()

    .build();
  SwaggerModule.setup(
    '/swagger',
    app,
    SwaggerModule.createDocument(app, swagConfig),
    {
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
}

bootstrap();
