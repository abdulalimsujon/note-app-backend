import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.services';
import { UserRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/strategy/local.strategy';
import { UserModule } from '../users/user.module';
import { config } from 'process';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [UserRepository, AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
