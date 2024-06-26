import { Injectable, Inject } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Redis } from 'ioredis';
import { MessageBullService } from 'src/bull/bull.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly messageBullService: MessageBullService,
  ) {}
  async create(createMessageInput: CreateMessageInput) {
    const id = await this.redis.incr('id');
    const messageWithId = { id, ...createMessageInput };
    await this.messageBullService.addJob(messageWithId);
    return messageWithId;
  }

  async saveMessage(message: any) {
    this.redis.set(`message:${message.id}`, JSON.stringify(message));
  }

  findAll() {
    return this.redis
      .keys('message:*')
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((messages) => {
        return messages.map((message) => {
          const parsedMessage = JSON.parse(message);
          return { ...parsedMessage, id: parseInt(parsedMessage.id) };
        });
      });
  }

  findOne(id: number) {
    return this.redis.get(`message:${id}`).then((message) => {
      if (!message) {
        return null;
      }
      const parsedMessage = JSON.parse(message);
      return { ...parsedMessage, id: parseInt(parsedMessage.id) };
    });
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return this.redis.get(`message:${id}`).then((message) => {
      if (!message) {
        return null;
      }
      const parsedMessage = JSON.parse(message);
      const updatedMessage = {
        ...parsedMessage,
        ...updateMessageInput,
      };
      this.redis.set(`message:${id}`, JSON.stringify(updatedMessage));
      return updatedMessage;
    });
  }

  remove(id: number) {
    return this.redis.del(`message:${id}`);
  }
  async findAllByConversationId(conversationId: number) {
    return this.redis
      .keys(`message:*`)
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((messages) => {
        return messages
          .map((message) => JSON.parse(message))
          .filter((message) => message.conversationId === conversationId)
          .map((message) => {
            return { ...message, id: parseInt(message.id) };
          });
      });
  }
}
