import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(name: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(name, password);
    console.log('this is from local strategy', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
