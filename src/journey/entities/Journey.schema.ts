import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Journey {
  @Prop({ required: true, unique: false })
  userId: string;
  @Prop({ required: true, unique: false})
  establishmentId: string;
  @Prop({ required: false, unique: false })
  comment: string;
}

export const JourneySchema = SchemaFactory.createForClass(Journey);
