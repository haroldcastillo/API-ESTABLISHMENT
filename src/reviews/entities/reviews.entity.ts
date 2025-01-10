import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Reviews {
  @Prop({ required: true, unique: false })
  userId: string;
  @Prop({ required: true, unique: false })
  establishmentId: string;
  @Prop({ required: true, unique: false })
  createdAt: Date;
  @Prop({ required: true, unique: false })
  rating: number;
  @Prop({ required: false, unique: false })
  comment: string;
  @Prop({ required: false, unique: false })
  photo: string[];
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
