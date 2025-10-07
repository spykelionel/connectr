import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'],
  });

  // setup swagger docs
  const swagConfig = new DocumentBuilder()
    .setTitle('Connectr API')
    .setDescription('Connectr - Social Network Platform API Documentation')
    .setVersion('1.0')
    .setContact('Connectr Team', 'https://connectr.com', 'support@connectr.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:8000', 'Development server')
    .addServer('https://api.connectr.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Authorization',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Posts', 'Post creation, management, and interaction endpoints')
    .addTag(
      'Comments',
      'Comment creation, management, and interaction endpoints',
    )
    .addTag('Networks', 'Network creation, management, and member endpoints')
    .addTag('Roles', 'Role management endpoints')
    .addTag(
      'Connections',
      'Friend connection and relationship management endpoints',
    )
    .addTag('File Upload', 'Cloudinary file upload and management endpoints')
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
