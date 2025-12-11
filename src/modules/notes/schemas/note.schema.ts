import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type noteDocument = notes & Document;

export class notes {
    
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

export const noteSchema = SchemaFactory.createForClass(notes);