import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from '../services/note.service';
import { CreateNoteDto } from '../dto/create-note-dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Note } from '../schemas/note.schema';
import { UpdateNoteDto } from '../dto/update-dto';
import { GetNotesDto } from '../dto/get-note-dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Note')
@ApiBearerAuth('JWT')
@Controller('api/notes')
@UseGuards(AuthGuard('jwt'))
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 200,
    description: 'Note successfully created',
    type: Note,
  })
  async createNote(@Body() dto: CreateNoteDto) {
    return this.noteService.createNote(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all notes' })
  async getAllNotes(@Query() query: GetNotesDto) {
    return this.noteService.getAllNotes(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get note by ID' })
  async getNoteById(@Param('id') id: string) {
    return this.noteService.getNoteById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
    type: Note,
  })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async updateNote(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.noteService.updateNote(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete note by ID' })
  async deleteNote(@Param('id') id: string) {
    return this.noteService.deleteNote(id);
  }

  // @Delete('hard/:id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Hard delete note by ID' })
  // async hardDeleteNote(@Param('id') id: string) {
  //   return this.noteService.hardDeleteNote(id);
  // }
}
