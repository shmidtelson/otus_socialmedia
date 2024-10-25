import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    // Implement authentication logic here
    return { message: 'Logged in successfully!' };
  }
}