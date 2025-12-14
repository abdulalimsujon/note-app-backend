import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Note, NoteDocument } from '../schemas/note.schema';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class NoteRepository extends BaseRepository<NoteDocument> {
  constructor(
    @InjectModel(Note.name) private readonly NoteModel: Model<NoteDocument>,
    // It tells NestJS to inject the Mongoose model for the Note schema into this property.
  ) {
    super(NoteModel);
  }
}
