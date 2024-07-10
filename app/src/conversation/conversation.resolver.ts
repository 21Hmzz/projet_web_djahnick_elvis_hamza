import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { MessageService } from 'src/message/message.service';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(
    private readonly conversationService: ConversationService,
    private messageService: MessageService,
    private userService: UsersService,
  ) {}

  @Mutation(() => Conversation)
  createConversation(
    @Args('createConversationInput')
    createConversationInput: CreateConversationInput,
  ) {
    return this.conversationService.create(createConversationInput);
  }

  @Query(() => [Conversation], { name: 'conversations' })
  findAll() {
    return this.conversationService.findAll();
  }

  @Query(() => Conversation, { name: 'conversation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.conversationService.findOne(id);
  }

  @Query(() => [Message], { name: 'conversationMessages' })
  async conversationMessages(@Args('id', { type: () => Int }) id: number) {
    const conversation = await this.conversationService.findOne(id);
    return conversation.messages || [];
  }

  @Mutation(() => Conversation)
  updateConversation(
    @Args('updateConversationInput')
    updateConversationInput: UpdateConversationInput,
  ) {
    return this.conversationService.update(
      updateConversationInput.id,
      updateConversationInput,
    );
  }

  @Mutation(() => Conversation)
  removeConversation(@Args('id', { type: () => Int }) id: number) {
    return this.conversationService.remove(id);
  }

  @ResolveField(() => [Message])
  async messages(@Parent() conversation: Conversation) {
    return this.messageService.findAllByConversationId(conversation.id);
  }

  @ResolveField(() => User)
  async user(@Parent() conversation: Conversation) {
    return this.userService.findOne(conversation.userId);
  }

  @ResolveField(() => User)
  async recipient(@Parent() conversation: Conversation) {
    return this.userService.findOne(conversation.recipientId);
  }
}
