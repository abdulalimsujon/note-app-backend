import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.services';
import { UserRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserRepository, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
