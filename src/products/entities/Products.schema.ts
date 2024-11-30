import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Products {
  @Prop({ required: true, unique: false })
  name: string;
  @Prop({ required: true ,unique: false})
  price: number;
  @Prop({ required: true, unique: false })
  description: string;
  @Prop({ required: true, unique: false })
  stock: number;
  @Prop({ required: true, unique: false })
  image: string;
  @Prop({ required: true, unique: false })
  category: string;
  @Prop({ required: true, unique: false })
  brand: string;
  @Prop({required: true})
  createdAt: Date;
  // @Prop({required: true})
  // updatedAt: Date;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
