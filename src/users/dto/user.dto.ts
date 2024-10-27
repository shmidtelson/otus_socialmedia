import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserDto extends CreateUserDto {
  @IsUUID()
  @IsEmpty()
  @ApiProperty({
    example: '1caf2eba-5254-44df-ba9f-9c4ba3d4cb39',
  })
  id: string;
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
}

export class UserEntity {
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
