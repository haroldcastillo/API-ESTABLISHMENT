import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsUrl,
  isBoolean,
  IsBoolean,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsEnum(['admin', 'user'], { message: 'role must be either admin or user' })
  role: 'admin' | 'user';

  @IsUrl()
  image: string;

  @IsBoolean()
  isVerified: boolean;

  // @IsBoolean()
  // @IsNotEmpty()
  // isVerified: boolean;
}
