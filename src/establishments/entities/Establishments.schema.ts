import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema()
export class Establishments {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  description: string;

  @Prop({ required: true, unique: false })
  address: string;

  @Prop({ required: true, unique: false })
  barangay: string;

  @Prop({ required: false, unique: false })
  phone: string;

  @Prop({ required: true, unique: false })
  type: string;

  @Prop({ required: true, unique: false })
  picture: [string];

  @Prop({ required: true, unique: false })
  open: string;

  @Prop({ required: true, unique: false })
  close: string;

  @Prop({ required: false, unique: false })
  facebook: string;

  @Prop({ required: true, unique: false })
  creatorId: string;

  @Prop({ required: true, unique: false, default: 0 })
  views: number;

  @Prop({ required: true, unique: false, default: false })
  isVerified: boolean;

  @Prop({ required: true, unique: false, default: 0 })
  rating: number;

  @Prop({ required: false, unique: false })
  totalReviews: number;
}

export const EstablishmentsSchema =
  SchemaFactory.createForClass(Establishments);
