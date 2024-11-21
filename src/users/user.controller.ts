import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({ description: 'User registered', type: UserDto })
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get/:id')
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  @ApiOperation({ summary: 'Search users' })
  @ApiOkResponse({ description: 'User', type: UserDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiQuery({ name: 'first_name', required: true, example: 'John' })
  @ApiQuery({ name: 'last_name', required: true, example: 'Doe' })
  @Get('search')
  async search(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ): Promise<UserDto[]> {
    const users = await this.userService.search({ first_name, last_name });

    if (!users) throw new NotFoundException('No users found!');

    return users.map((user) => new UserDto(user));
  }
}
