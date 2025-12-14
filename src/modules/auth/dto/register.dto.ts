import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/modules/users/enums/users.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Abdul Alim', description: 'Full name of the user' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'alim@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password for login',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    enum: UserType,
    default: UserType.USER,
    description: 'Role of the user',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: `Role must be one of: ${Object.values(UserType).join(', ')}`,
  })
  role?: UserType;
}
