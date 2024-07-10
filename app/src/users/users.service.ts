import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { ConversationService } from 'src/conversation/conversation.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly conversationsService: ConversationService,
    private readonly prisma: PrismaClient 
  ) {}
  async create(createUserInput: CreateUserInput) {
    const id = await this.redis.incr('id');
    const userWithId = { id, ...createUserInput };
    this.redis.set(`user:${id}`, JSON.stringify(userWithId));
    this.prisma.user.create({
      data: createUserInput
    })
    return userWithId;
  }

  me(token: string) {
    const user = this.jwtService.decode(token);
    return this.findOne(user.id);
  }

  findAll() {
    return this.redis
      .keys('user:*')
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((users) => {
        return users.map((user) => {
          const parsedUser = JSON.parse(user);
          const userId = parseInt(parsedUser.id);
          if (isNaN(userId)) {
            throw new Error(`User ID is not a number for user: ${user}`);
          }
          return { ...parsedUser, id: userId };
        });
      });
  }

  async findOne(id: number) {
    const user = await this.redis.get(`user:${id}`);
    if (!user) {
      return null;
    }
    const parsedUser = JSON.parse(user);
    const conversations = await this.conversationsService.findAllByUserId(id);
    return { ...parsedUser, id: parseInt(parsedUser.id), conversations };
  }
  async findOneByEmail(email: string) {
    const keys = await this.redis.keys('user:*');
    for (const key of keys) {
      const user = await this.redis.get(key);
      const parsedUser = JSON.parse(user);
      if (parsedUser.email === email) {
        return { ...parsedUser, id: parseInt(parsedUser.id) };
      }
    }
    return null;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.redis.get(`user:${id}`).then((user) => {
      if (!user) {
        return null;
      }
      const parsedUser = JSON.parse(user);
      const updatedUser = { ...parsedUser, ...updateUserInput };
      this.redis.set(`user:${id}`, JSON.stringify(updatedUser));
      this.prisma.user.update({
        where:{id : id},
        data: updatedUser
      })
      return updatedUser;
    });
  }

  remove(id: number) {
    return this.redis.get(`user:${id}`).then((user) => {
      if (!user) {
        return null;
      }
      this.redis.del(`user:${id}`);
      this.prisma.user.delete({
        where:{id : id},
      })
      return JSON.parse(user);
    });
  }
}
