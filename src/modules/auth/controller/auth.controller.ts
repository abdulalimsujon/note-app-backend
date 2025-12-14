import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.services';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
