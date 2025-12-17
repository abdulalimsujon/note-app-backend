// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.fiter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);

    // Helmet for security
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
        crossOriginEmbedderPolicy: false,
      }),
    );

    // Enable CORS
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: process.env.NODE_ENV === 'production',
      }),
    );

    // Global Filters & Interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalInterceptors(new BigIntSerializerInterceptor());

    // Swagger setup
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Note App API')
      .setDescription('API documentation for the Note App')
      .setVersion('1.0')
      .addTag('note')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    // Listen on port
    const port = configService.get<number>('SERVER_PORT') || 3100;
    await app.listen(port);

    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
    logger.log(`🚀 Note Service running at http://localhost:${port}`);
    logger.log(`📝 Environment: ${nodeEnv}`);
    logger.log(`🌐 Global prefix: /api`);
    logger.log(`🔒 CORS enabled for: *`);
    logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
  } catch (error) {
    logger.error('❌ Failed to start the application', error);
    process.exit(1); // Exit with failure code
  }
}

bootstrap();
