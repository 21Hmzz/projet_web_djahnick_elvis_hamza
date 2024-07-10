import { Test, TestingModule } from '@nestjs/testing';
import { MessageBullService } from '../bull/bull.service';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import Redis from 'ioredis-mock';
import { Queue } from 'bull';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let messageService: MessageService;

  beforeEach(async () => {
    const redisClient = new Redis({
      data: {
        'message:1': JSON.stringify({
          id: 1,
          conversationId: 1,
          content: 'hey this as message',
          userId: 1,
          date: '19/06/2024'
        }),
      },
    });

    const messagesQueueMock = {
      add: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        MessageService,
        {
          provide: 'REDIS',
          useValue: redisClient,
        },
        {
          provide: 'BullQueue_messages',
          useValue: messagesQueueMock,
        },
        {
          provide: MessageBullService,
          useFactory: (queue: Queue) => new MessageBullService(queue),
          inject: ['BullQueue_messages'],
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const createMessageInput: CreateMessageInput = {
        conversationId: 1,
        content: 'hey this as message',
        userId: 1,
        date: '19/06/2024',
      };

  
      const result = await resolver.createMessage(createMessageInput);
      const resultTest = await resolver.findOne(result.id);
      console.log("result tesId ",resultTest.id)
      expect(result.id).toBe(resultTest.id);

    });
  });

});
