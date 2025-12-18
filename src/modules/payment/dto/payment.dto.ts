import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID of the user making the payment' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Amount to be paid', example: 100 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency of the payment', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Amount to be paid',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Currency of the payment',
    example: 'USD',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({ description: 'Soft delete flag', required: false })
  @IsOptional()
  isDeleted?: boolean;
}
