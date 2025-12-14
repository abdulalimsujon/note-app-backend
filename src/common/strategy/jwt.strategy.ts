import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AnyAaaaRecord } from 'dns';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/users/services/user.service';

interface JwtPayload {
  id: number;
  username: string;
  role: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);

    return {
      id: payload.id,
      username: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }
}
