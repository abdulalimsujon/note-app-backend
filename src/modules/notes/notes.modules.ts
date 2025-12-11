import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    ConfigModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class NotificationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer;
    // .apply(otpRateLimiter)
    // .forRoutes({ path: 'api/otp/generate', method: RequestMethod.POST });
  }
}
