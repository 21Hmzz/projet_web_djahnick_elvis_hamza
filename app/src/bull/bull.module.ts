import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullService, MessageBullService } from './bull.service';
import { MessagesProcessor } from './bull.processor';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [
    BullModule.forRoot({
      // redis: 'redis://red-cppadpqj1k6c73fvf120:6379',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'messages',
      },
      {
        name: 'redisqueue',
      },
    ),
  ],
  providers: [
    BullService,
    MessagesProcessor,
    MessageService,
    MessageBullService,
  ],
  exports: [BullService, MessageBullService],
})
export class BullQueueModule {}
