import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty({
    example: '12345',
  })
  @IsString()
  password: string;
}