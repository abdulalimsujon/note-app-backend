import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotePriority } from '../enums/NotePriority.enum';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Title of the note',
    example: 'My first note',
  })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'Content of the note',
    example: 'This is the content of my note',
  })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    description: 'Tag associated with the note',
    example: 'work',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tag must be a string' })
  tags?: string;

  @ApiProperty({
    description: 'Priority of the note',
    enum: NotePriority,
    example: NotePriority.LOW,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotePriority, {
    message: `Priority must be one of: ${Object.values(NotePriority).join(', ')}`,
  })
  priority?: NotePriority;
}
