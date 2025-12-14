import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { NoteRepository } from './repository/note.repository';
import { NoteService } from './services/note.service';
import { NoteController } from './controllers/note.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // MongooseModule.forFeature() is a NestJS helper to define which Mongoose schemas/models are registered in a specific module.It tells NestJS which collections/models this module can use via dependency injection.
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [NoteController],
  providers: [NoteRepository, NoteService],
  exports: [NoteService],
})
export class NoteModule {}
