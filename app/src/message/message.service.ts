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
    console.log('createMessageInput', createMessageInput);
    const id = await this.redis.incr('id');
    const messageWithId = { id, ...createMessageInput };
    await this.messageBullService.addJob({ data: messageWithId });
    return messageWithId;
  }

  async saveMessage(message: any) {
    let data = JSON.parse(message);
    data = data.data;
    await this.redis.set(`message:${data.id}`, JSON.stringify(data));
  }

  // findAll() {
  //   return this.redis
  //     .keys('message:*')
  //     .then((keys) => {
  //       return Promise.all(keys.map((key) => this.redis.get(key)));
  //     })
  //     .then((messages) => {
  //       return messages.map((message) => {
  //         const parsedMessage = JSON.parse(message);
  //         return { ...parsedMessage, id: parseInt(parsedMessage.id) };
  //       });
  //     });
  // }

  findAll() {
    //delete all messages
    // this.redis.keys('message:*').then((keys) => {
    //   keys.map((key) => this.redis.del(key));
    // });
    return this.redis
      .keys('message:*')
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((messages) => {
        return messages
          .map((message) => JSON.parse(message))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ) // Tri par ordre de création avec dates ISO
          .map((message) => {
            return { ...message, id: parseInt(message.id) };
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
  // async findAllByConversationId(conversationId: number) {
  //   return this.redis
  //     .keys(`message:*`)
  //     .then((keys) => {
  //       return Promise.all(keys.map((key) => this.redis.get(key)));
  //     })
  //     .then((messages) => {
  //       return messages
  //         .map((message) => JSON.parse(message))
  //         .filter((message) => message.conversationId === conversationId)
  //         .map((message) => {
  //           return { ...message, id: parseInt(message.id) };
  //         });
  //     });
  // }
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
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ) // Tri par ordre de création avec dates ISO
          .map((message) => {
            return { ...message, id: parseInt(message.id) };
          });
      });
  }

  async setMessageRead(id: number) {
    return this.redis.get(`message:${id}`).then((message) => {
      if (!message) {
        return null;
      }
      const parsedMessage = JSON.parse(message);
      const updatedMessage = {
        ...parsedMessage,
        read: true,
      };
      this.redis.set(`message:${id}`, JSON.stringify(updatedMessage));
      return updatedMessage;
    });
  }
}
