import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Bucketlist {
  @Prop({ required: true, unique: false })
  userId: string;
  @Prop({ required: true, unique: false })
  establishmentId: string;
  @Prop({ required: true, unique: false })
  createdAt: Date;
  @Prop({ required: true, unique: false })
  type: string;
  @Prop({ required: false, unique: false, default: '' })
  description: string;
}

export const BucketlistSchema = SchemaFactory.createForClass(Bucketlist);
