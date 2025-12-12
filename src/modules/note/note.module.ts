import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { NoteRepository } from './repository/note.repository';
import { NoteService } from './services/note.service';
import { NoteController } from './controllers/note.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    ConfigModule,
  ],
  controllers: [NoteController],
  providers: [NoteRepository, NoteService],
  exports: [NoteService],
})
export class NoteModule {}
