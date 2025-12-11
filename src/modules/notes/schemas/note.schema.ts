import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  sharedWith: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isPrivate: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
