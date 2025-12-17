import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserModule } from '../users/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.services';
import { UserRepository } from './repository/auth.repository';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { LocalStrategy } from 'src/common/strategy/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    UserModule,
<<<<<<< HEAD
    JwtModule.register({
      secret: 'dalgjdaljgl;ak', // hardcoded secret
      signOptions: { expiresIn: '1h' },
=======
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
>>>>>>> 022c2a5995ed9942dfa6c311e6e03c646ca5a1bb
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
