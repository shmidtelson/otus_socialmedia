import { Controller, Post, Get, Param, Body,  NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get('get/:id')
  async getUser(@Param('id') id: number) {
    const user= await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }
}