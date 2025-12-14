// src/common/guards/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('AUTH HEADER:', req.headers.authorization); // check token
    console.log('INFO:', info); // Passport info object

    if (err || !user) {
      throw err || new UnauthorizedException('No auth token');
    }
    return user; // <-- this becomes req.user
  }
}
