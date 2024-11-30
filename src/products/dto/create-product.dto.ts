import { IsString,IsNotEmpty,IsNumber,IsUrl, IsDate, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @IsEnum(["electronics", "clothing", "food", "books", "furniture"], { message: "category must be either electronics, clothing, food, books, or furniture" })
  category: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  // @IsDate()
  // @IsNotEmpty()
  // createdAt: Date;

  // @IsDate()
  // @IsNotEmpty()
  // updatedAt: Date;
}
