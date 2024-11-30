import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Favorites {
  @Prop({ required: true, unique: false })
  userId: string; 
  @Prop({ required: true, unique: false })
  establishmentId: string;
  @Prop({ required: true, unique: false })
  createdAt: Date;
  @Prop({ required: true, unique: false })
  type: string[];  
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);
