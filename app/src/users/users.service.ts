import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly conversationsService: ConversationService,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const id = await this.redis.incr('id');
    const userWithId = { id, ...createUserInput };
    this.redis.set(`user:${id}`, JSON.stringify(userWithId));
    return userWithId;
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

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.redis.get(`user:${id}`).then((user) => {
      if (!user) {
        return null;
      }
      const parsedUser = JSON.parse(user);
      const updatedUser = { ...parsedUser, ...updateUserInput };
      this.redis.set(`user:${id}`, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  remove(id: number) {
    return this.redis.get(`user:${id}`).then((user) => {
      if (!user) {
        return null;
      }
      this.redis.del(`user:${id}`);
      return JSON.parse(user);
    });
  }
}
