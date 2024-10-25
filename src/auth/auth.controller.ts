import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    return { message: 'Logged in successfully!' };
  }
}