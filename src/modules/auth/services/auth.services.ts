import {
  Injectable,
  Logger,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository/auth.repository';
import { LoginDto } from '../dto/login.dto';
import { UserType } from 'src/modules/users/enums/users.enum';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const isExists = await this.userRepository.exists({
      email: dto.email,
    });

    if (isExists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.createOne({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? UserType.USER,
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      filters: { email: dto.email },
      useLean: false,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      filters: { email },
      useLean: false,
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    const { password, ...result } = user.toObject();
    return result;
  }
}
