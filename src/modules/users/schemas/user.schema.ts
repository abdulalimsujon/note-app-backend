import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserType } from '../enums/users.enum';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'user',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserType),
    default: UserType.USER,
  })
  role: UserType;
}
export const UserSchema = SchemaFactory.createForClass(User);
