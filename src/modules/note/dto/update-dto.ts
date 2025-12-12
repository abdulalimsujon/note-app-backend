import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotePriority } from '../enums/NotePriority.enum';

export class UpdateNoteDto {
  @ApiPropertyOptional({
    description: 'Title of the note',
    example: 'Updated note title',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Content of the note',
    example: 'Updated content of the note',
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Tag associated with the note',
    example: 'personal',
  })
  @IsOptional()
  @IsString({ message: 'Tag must be a string' })
  tags?: string;

  @ApiPropertyOptional({
    description: 'Priority of the note',
    enum: NotePriority,
    example: NotePriority.HIGH,
  })
  @IsOptional()
  @IsEnum(NotePriority, {
    message: `Priority must be one of: ${Object.values(NotePriority).join(', ')}`,
  })
  priority?: NotePriority;
}
