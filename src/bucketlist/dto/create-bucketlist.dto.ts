import { IsString, IsNotEmpty, IsDate } from 'class-validator';
export class CreateBucketlistDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  establishmentId: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  description?: string;
}
