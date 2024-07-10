import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from 'src/bull/bull.module';

@Module({
  imports: [BullQueueModule],
  providers: [MessageResolver, MessageService],
  exports: [MessageService]
})
export class MessageModule {}
