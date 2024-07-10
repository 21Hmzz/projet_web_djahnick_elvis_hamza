import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message/message.service';
import { CreateMessageInput } from './message/dto/create-message.input';
import { Message } from './message/entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // Permet à tous les domaines de se connecter, ajustez selon vos besoins
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('New client connected' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected' + client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: Message): Promise<void> {
    try {
      console.log('payload', payload);
      console.log('client', client.id);
      const { content, conversationId, userId, date } = payload;
      const data: CreateMessageInput = {
        content,
        conversationId,
        userId,
        date,
      };
      const newMessage = await this.messageService.create(data);
      this.server.emit('newMessage', newMessage);
    } catch (error) {
      console.error(error);
    }
  }

  sendMessage(message: any) {
    console.log('messageSend', message);
    this.server.emit('message', message);
  }
}
