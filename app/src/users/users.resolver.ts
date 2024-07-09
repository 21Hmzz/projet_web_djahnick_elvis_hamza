import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { AuthPayload, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { AuthService } from 'src/auth/auth.service';
import { ConversationService } from 'src/conversation/conversation.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private conversationService: ConversationService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  me(@Context('req') req) {
    if (req.user) {
      return req.user;
    }
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => [Conversation], { name: 'userConversations' })
  async userConversations(@Args('id', { type: () => Int }) id: number) {
    const user = await this.usersService.findOne(id);
    return user.conversations || [];
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => AuthPayload, { name: 'login' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Mutation(() => AuthPayload, { name: 'signIn' })
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('lastname') lastname: string,
    @Args('firstname') firstname: string,
  ) {
    console.log('signIn', email, password, lastname, firstname);
    return this.authService.signIn({ email, password, lastname, firstname });
  }

  @ResolveField(() => [Conversation])
  conversations(@Parent() user: User) {
    const { id } = user;
    return this.conversationService.findAllByUserId(id);
  }
}
