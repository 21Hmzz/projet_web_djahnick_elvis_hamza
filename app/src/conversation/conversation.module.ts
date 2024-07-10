import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { BullQueueModule } from 'src/bull/bull.module';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from 'src/chat.module';
import { UsersModule } from 'src/users/users.module';
import { MessageModule } from 'src/message/message.module';
import { PrismaClient } from '@prisma/client';


@Module({
  imports: [
    forwardRef(() => ChatModule),
    forwardRef(() => BullQueueModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MessageModule),
  ],
  providers: [ConversationResolver, ConversationService, JwtService,PrismaClient],
  exports: [ConversationService],
})
export class ConversationModule {}
