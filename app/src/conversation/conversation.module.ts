import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { MessageService } from 'src/message/message.service';
import { BullQueueModule } from 'src/bull/bull.module';

@Module({
  imports: [BullQueueModule],
  providers: [ConversationResolver, ConversationService, MessageService],
  exports: [ConversationService],
})
export class ConversationModule {}
