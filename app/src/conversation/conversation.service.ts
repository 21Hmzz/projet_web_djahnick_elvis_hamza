import { Injectable, Inject } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { MessageService } from 'src/message/message.service';
import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class ConversationService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private messagesService: MessageService,
    private readonly prisma: PrismaClient
  ) {}
  async create(createConversationInput: CreateConversationInput) {
    const id = await this.redis.incr('id');
    const conversationWithId = { id, ...createConversationInput };
    this.redis.set(`conversation:${id}`, JSON.stringify(conversationWithId));
    this.prisma.conversation.create({
      data: createConversationInput
    })
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
      this.prisma.conversation.update({
        where: {id: id},
        data: updatedConversation
      })
      return updatedConversation;
    });
  }

  remove(id: number) {
    return this.redis.get(`conversation:${id}`).then((conversation) => {
      if (!conversation) {
        return null;
      }
      this.redis.del(`conversation:${id}`);
      this.prisma.conversation.delete({
        where: {id: id},
      })
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
          .filter(
            (conversation) =>
              conversation.userId === userId ||
              conversation.recipientId === userId,
          )
          .map((conversation) => {
            return { ...conversation, id: parseInt(conversation.id) };
          });
      });
  }
}
