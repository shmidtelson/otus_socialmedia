import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UUID {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '1caf2eba-5254-44df-ba9f-9c4ba3d4cb39',
  })
  id: string;
}

export class LoginDto extends UUID {
  @ApiProperty({
    example: '12345',
  })
  @IsString()
  password: string;
}