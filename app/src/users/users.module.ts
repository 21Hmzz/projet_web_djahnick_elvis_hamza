import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { BullQueueModule } from 'src/bull/bull.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from 'src/chat.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { PrismaClient } from '@prisma/client';


@Module({
  imports: [
    forwardRef(() => ChatModule),
    forwardRef(() => BullQueueModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ConversationModule),
    JwtModule,
  ],
  providers: [UsersResolver, UsersService,PrismaClient],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
