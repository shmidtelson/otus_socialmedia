import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findById(loginDto.id);
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.usersService.findById(id);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
