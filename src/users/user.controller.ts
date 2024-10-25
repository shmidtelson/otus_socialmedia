import { Controller, Post, Get, Param, Body,  NotFoundException,HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User registered', type: UserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User', type: UserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  @Get('get/:id')
  async getUser(@Param('id') id: number) {
    const user= await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }
}