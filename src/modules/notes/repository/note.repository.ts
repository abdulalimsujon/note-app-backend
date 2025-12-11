import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Note, NoteDocument } from '../schemas/note.schema';
import { BaseRepository } from 'src/common/repository/note.repository';

@Injectable()
export class OtpRepository extends BaseRepository<NoteDocument> {
  constructor(
    @InjectModel(Note.name) private readonly NoteModel: Model<NoteDocument>,
  ) {
    super(NoteModel);
  }
}
