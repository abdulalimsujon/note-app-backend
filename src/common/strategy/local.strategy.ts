import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException(`User not found with email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from 'src/modules/auth/services/auth.services';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({ usernameField: 'id' });
//   }

//   async validate(id: string, password: string): Promise<any> {
//     const user = await this.authService.validateUser(id, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }

/* eslint-disable @typescript-eslint/no-unsafe-argument */
