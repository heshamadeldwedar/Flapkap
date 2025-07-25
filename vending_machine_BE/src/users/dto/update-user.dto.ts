import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  role_id?: number;
}
