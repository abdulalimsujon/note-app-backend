import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfing } from './config/db.config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    //config module
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    //database module
    MongooseModule.forRootAsync({
      useFactory: getDatabaseConfing,
      inject: [ConfigService],
    }),
     // Cache module
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
