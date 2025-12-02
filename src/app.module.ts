import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfing } from './config/db.config';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
