import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  @IsUUID()
  @IsEmpty()
  @ApiProperty({
    example: '1caf2eba-5254-44df-ba9f-9c4ba3d4cb39',
  })
  id: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  constructor(partial: Partial<UserDto>) {
    super();
    Object.assign(this, partial);
  }
}
