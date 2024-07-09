import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { MessageService } from 'src/message/message.service';
import { BullQueueModule } from 'src/bull/bull.module';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [BullQueueModule],
  providers: [
    ConversationResolver,
    ConversationService,
    MessageService,
    UsersService,
    JwtService,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
