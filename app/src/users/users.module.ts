import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { BullQueueModule } from 'src/bull/bull.module';

@Module({
  imports: [BullQueueModule],
  providers: [UsersResolver, UsersService, ConversationService, MessageService],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
