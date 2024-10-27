import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1970-01-01',
  })
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'male',
  })
  gender: string;

  @IsArray()
  @IsString({ each: true }) // "each" tells class-validator to run the validation on each item of the array
  @ApiProperty({
    example: ['Some interest'],
  })
  interests?: string[];

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Moscow',
  })
  city: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+/, {
    message:
      'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character',
  })
  @ApiProperty({
    example: '1234Abc!',
  })
  password: string;
}
