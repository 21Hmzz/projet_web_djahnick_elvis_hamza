// chat.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from './message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [ChatGateway],
  exports: [ChatGateway], // Exportez les services si nécessaire
})
export class ChatModule {}
