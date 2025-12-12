import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotePriority } from '../enums/NotePriority.enum';

export type NoteDocument = Note & Document;

@Schema({
  collection: 'note',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String })
  tags: string;

  @Prop({
    type: String,
    enum: Object.values(NotePriority),
    default: NotePriority.LOW,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  priority: NotePriority;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
