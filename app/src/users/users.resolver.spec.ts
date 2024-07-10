import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import Redis from 'ioredis-mock';
import { ConversationService } from '../conversation/conversation.service';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;
  let redisClient: Redis;

  beforeEach(async () => {
    redisClient = new Redis({
      data: {
        'id': '1',
      },
    });

    const conversationServiceMock = {
      findAllByUserId: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        ConversationService,
        {
          provide: 'REDIS',
          useValue: redisClient,
        },
        {
          provide: ConversationService,
          useValue: conversationServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('createUser and removeUser', () => {
    it('should create and remove a user', async () => {
      const createUserInput: CreateUserInput = {
        firstname: 'elvis',
        lastname: 'tavares',
        email: 'test@example.com',
        password: 'password',
      };

      const createdUser = await resolver.createUser(createUserInput);
      const resulFound = await resolver.findOne(createdUser.id)
      expect(createdUser.id).toBe(resulFound.id);

      // Test the update 
      const oldUserData = createdUser

      const updateUserInput : UpdateUserInput = {
        id: oldUserData.id,
        firstname: "Hamza",
        lastname: "Bella",
        email: oldUserData.email,
        password: oldUserData.password

      }
      //use update method 

     const newUpdatedUser = await resolver.updateUser(updateUserInput);
    
      expect(newUpdatedUser.lastname).toBe("Bella");
    });
  });
});
