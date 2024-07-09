import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { BullQueueModule } from 'src/bull/bull.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [BullQueueModule, JwtModule],
  providers: [
    UsersResolver,
    UsersService,
    ConversationService,
    MessageService,
    AuthService,
  ],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
