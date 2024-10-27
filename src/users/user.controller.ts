import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiOkResponse({ description: 'User registered', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiOkResponse({ description: 'User', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }
}
