import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    if (!password || user.password !== password) {
      throw new Error('Password is incorrect');
    }
    const payload = { subject: user.id, user_name: user.name };
    return {
      token: this.jwtService.sign(payload, { secret: 'secret' }),
    };
  }

  async signIn(createUserInput: CreateUserInput) {
    const user = await this.userService.findOneByEmail(createUserInput.email);
    if (user) {
      throw new Error('User already exists');
    }
    const newUser = await this.userService.create(createUserInput);
    const payload = { subject: newUser.id, email: newUser.email };
    return {
      token: this.jwtService.sign(payload, { secret: 'secret' }),
    };
  }
}
