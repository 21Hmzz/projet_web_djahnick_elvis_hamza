import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullService, MessageBullService } from './bull.service';
import { BullProcessor, MessagesProcessor } from './bull.processor';
import { ChatModule } from 'src/chat.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    forwardRef(() => MessageModule),
    BullModule.forRoot({
      // redis: 'redis://red-cppadpqj1k6c73fvf120:6379',
      connection: {
        host: 'redis://red-cppadpqj1k6c73fvf120',
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
    BullModule.registerFlowProducer({
      name: 'redis',
      connection: {
        host: 'redis://red-cppadpqj1k6c73fvf120',
        port: 6379,
      },
    }),
  ],
  providers: [
    BullService,
    MessagesProcessor,
    MessageBullService,
    BullProcessor,
  ],
  exports: [BullService, MessageBullService, MessagesProcessor, BullProcessor],
})
export class BullQueueModule {}
