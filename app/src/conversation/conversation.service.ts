import { Injectable, Inject } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { MessageService } from '../message/message.service';
import { Redis } from 'ioredis';

@Injectable()
export class ConversationService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private messagesService: MessageService,
  ) {}
  async create(createConversationInput: CreateConversationInput) {
    const id = await this.redis.incr('id');
    const conversationWithId = { id, ...createConversationInput };
    this.redis.set(`conversation:${id}`, JSON.stringify(conversationWithId));
    return conversationWithId;
  }

  findAll() {
    return this.redis
      .keys('conversation:*')
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((conversations) => {
        return conversations.map((conversation) => {
          const parsedConversation = JSON.parse(conversation);
          return { ...parsedConversation, id: parseInt(parsedConversation.id) };
        });
      });
  }

  findOne(id: number) {
    return this.redis.get(`conversation:${id}`).then((conversation) => {
      if (!conversation) {
        return null;
      }
      const parsedConversation = JSON.parse(conversation);
      return this.messagesService
        .findAllByConversationId(id)
        .then((messages) => {
          return {
            ...parsedConversation,
            id: parseInt(parsedConversation.id),
            messages,
          };
        });
    });
  }

  update(id: number, updateConversationInput: UpdateConversationInput) {
    return this.redis.get(`conversation:${id}`).then((conversation) => {
      if (!conversation) {
        return null;
      }
      const parsedConversation = JSON.parse(conversation);
      const updatedConversation = {
        ...parsedConversation,
        ...updateConversationInput,
      };
      this.redis.set(`conversation:${id}`, JSON.stringify(updatedConversation));
      return updatedConversation;
    });
  }

  remove(id: number) {
    return this.redis.get(`conversation:${id}`).then((conversation) => {
      if (!conversation) {
        return null;
      }
      this.redis.del(`conversation:${id}`);
      return JSON.parse(conversation);
    });
  }

  findAllByUserId(userId: number) {
    return this.redis
      .keys('conversation:*')
      .then((keys) => {
        return Promise.all(keys.map((key) => this.redis.get(key)));
      })
      .then((conversations) => {
        return conversations
          .map((conversation) => JSON.parse(conversation))
          .filter((conversation) => conversation.userId === userId)
          .map((conversation) => {
            return { ...conversation, id: parseInt(conversation.id) };
          });
      });
  }
}
