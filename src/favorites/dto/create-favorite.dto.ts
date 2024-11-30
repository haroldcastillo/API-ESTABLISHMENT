import { IsString,IsNotEmpty } from 'class-validator';
export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  establishmentId: string;

  @IsString()
  @IsNotEmpty()
  type: string[];
}
