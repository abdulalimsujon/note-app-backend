import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.fiter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';


async function bootstrap() {
const logger = new Logger('Bootstrap');
  try{
    const app = await NestFactory.create(AppModule,{
      logger: ['error', 'warn', 'log', 'debug', 'verbose']
    });
    const configService = app.get(ConfigService);
    await app.listen(process.env.PORT ?? 3000);


    //  Helmet is a Node.js middleware that helps secure your app by setting various HTTP headers.
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
   
     app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: process.env.NODE_ENV === 'production',
      }),
    );

  
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  }catch(error){

  }

  
  
}
bootstrap();
