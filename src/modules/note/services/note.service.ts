import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note-dto';
import { NoteRepository } from '../repository/note.repository';
import { NoteDocument } from '../schemas/note.schema';
import { UpdateNoteDto } from '../dto/update-dto';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(private readonly noteRepository: NoteRepository) {}

  async createNote(dto: CreateNoteDto) {
    const note = await this.noteRepository.create(dto);
    this.logger.log(`Note created with ID: ${note['_id']}`);
    return { success: true, message: 'Note created successfully', data: note };
  }

  async getAllNotes(params?: {
    filter?: any;
    page?: string;
    length?: string;
    sort?: string;
  }) {
    const filterObj = params?.filter || {};

    // Convert object to string if required by BaseRepository
    const filterStr =
      typeof filterObj === 'string' ? filterObj : JSON.stringify(filterObj);

    const { data, pagination } = await this.noteRepository.getAllData({
      filter: filterStr,
      page: params?.page || '1',
      length: params?.length || '10',
      sortStr: params?.sort || '-createdAt',
      filterableFields: ['title', 'content', 'tags', 'priority'],
      useLean: true,
    });

    return {
      success: true,
      message: 'Notes retrieved successfully',
      data,
      pagination,
    };
  }

  async getNoteById(id: string) {
    const note = await this.noteRepository.findById({ id });
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return {
      success: true,
      message: 'Note retrieved successfully',
      data: note,
    };
  }

  async updateNote(id: string, dto: UpdateNoteDto) {
    const updatedNote = await this.noteRepository.updateByID(id, dto, {
      useLean: true,
    });
    if (!updatedNote)
      throw new NotFoundException(`Note with ID ${id} not found`);
    return {
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    };
  }

  async deleteNote(id: string) {
    const deletedNote = await this.noteRepository.softDeleteById(id);
    Logger.log('delete data', deletedNote);
    if (!deletedNote)
      throw new NotFoundException(`Note with ID ${id} not found`);
    return {
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote,
    };
  }

  // async hardDeleteNote(id: string) {
  //   const deletedNote = await this.noteRepository.deleteById(id);
  //   if (!deletedNote)
  //     throw new NotFoundException(`Note with ID ${id} not found`);
  //   return {
  //     success: true,
  //     message: 'Note permanently deleted',
  //     data: deletedNote,
  //   };
  // }
}
