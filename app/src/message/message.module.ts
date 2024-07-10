import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from 'src/bull/bull.module';
import { ChatModule } from 'src/chat.module';

@Module({
  imports: [forwardRef(() => BullQueueModule), forwardRef(() => ChatModule)],
  providers: [MessageResolver, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
