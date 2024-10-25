import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsUUID } from 'class-validator';

export class UserDto extends CreateUserDto {
  @IsUUID()
  @IsEmpty()
  @ApiProperty({
    example: '1caf2eba-5254-44df-ba9f-9c4ba3d4cb39',
  })
  id: string;
}
