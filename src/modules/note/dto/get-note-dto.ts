import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetNotesDto {
  @ApiPropertyOptional({ description: 'Filter object as JSON string' })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({ description: 'Page number', default: '1' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page', default: '10' })
  @IsOptional()
  @IsString()
  length?: string;

  @ApiPropertyOptional({
    description: 'Sort string, e.g., -createdAt',
    default: '-createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
