import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from 'src/bull/bull.module';
import { ChatModule } from 'src/chat.module';
import { PrismaClient } from '@prisma/client';
@Module({
  imports: [forwardRef(() => BullQueueModule), forwardRef(() => ChatModule)],
  providers: [MessageResolver, MessageService,PrismaClient],
  exports: [MessageService],
})
export class MessageModule {}
