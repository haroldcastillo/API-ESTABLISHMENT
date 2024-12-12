import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: false })
  first_name: string;
  @Prop({ required: true, unique: false })
  last_name: string;
  @Prop({ required: false, unique: false })
  middle_name: string;
  @Prop({ required: true, unique: false })
  password: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: false })
  contactNumber: string;
  @Prop({ required: true, unique: false })
  role: string;
  @Prop({ required: false, unique: false })
  image: string;
  @Prop({ required: false, unique: false })
  createdAt: Date;
  @Prop({ required: false, unique: false })
  preferences: string[];
  @Prop({ required: false, unique: false, default: false })
  isVerified: boolean;
  @Prop({ required: false, unique: false })
  lastViewed: [{ establishmentId: string; date: Date }];
}

export const UserSchema = SchemaFactory.createForClass(User);
