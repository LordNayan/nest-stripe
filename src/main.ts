import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createDefaultAdminUser } from './common/utils/create-default-admin-user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nest Stripe API')
    .setDescription('API documentation for Nest Stripe subscription system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Create default admin user if not exists
  await createDefaultAdminUser(app);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  const appUrl = await app.getUrl();

  Logger.log(`Nest application successfully started at ${appUrl}`, 'NestApplication');
  Logger.log(`API docs available at: ${appUrl}/api`, 'NestApplication');

  const adminEmail = 'admin@stripe.local';
  const adminPassword = 'admin123';
  Logger.log(`  Admin Email: ${adminEmail}`, 'NestApplication');
  Logger.log(`  Admin Password: ${adminPassword}`, 'NestApplication');
}

bootstrap();
