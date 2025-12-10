import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const getDatabaseConfing = (
  ConfigService: ConfigService,
): MongooseModuleOptions => {
  const uri = ConfigService.get<string>('MONGOOSE_URI');

  if (!uri) {
    throw new Error('MONGOOSE_URI is not defined in environment variables');
  }

  return {
    uri,
    onConnectionCreate(connection: Connection) {
      Logger.debug('Database connected successfully');
      connection.on('open', () => {
        Logger.debug('Database connected successfully');
      });
    },
  };
};
