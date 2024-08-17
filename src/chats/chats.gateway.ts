import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from 'src/config/guard/ws-jwt-auth.guard';
import { wsAuthMiddleware } from 'src/config/middleware/ws-auth.middleware';
import { SocketEvents } from 'src/config/util/enums';

@WebSocketGateway(81, {
  // namespace: '/chats',
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtAuthGuard)
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    this.server.on(SocketEvents.CONNECT, () => {
      return { sender: client.id };
    });
    Logger.log(`Client connected ${client?.id}`);
  }

  handleDisconnect(client: Socket) {
    this.server.off(SocketEvents.CONNECT, () => {
      return { sender: client.id };
    });
    console.log(`Client disconnected: ${client?.id}`);
  }

  @SubscribeMessage(SocketEvents.JOINROOM)
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    client.emit(SocketEvents.JOINROOM, room);
    Logger.log(`Client ${client.id} joined room ${room}`);
  }

  //TODO: check for existing chat room
  @SubscribeMessage(SocketEvents.MESSAGE)
  async create(
    @ConnectedSocket() client,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    Logger.log(
      `Received message from ${client?.id} to ${createChatDto?.room_id}`,
    );

    // to store to DB
    const senderId = client?.handshake?.user?._id.toString();

    const chat = await this.chatsService.create(senderId, createChatDto);
    this.server.to(createChatDto?.room_id).emit(SocketEvents.REPLY, chat);

    // sent message to room without storing to DB
    // this.server
    //   .to(createChatDto?.room_id)
    //   .emit(SocketEvents.REPLY, { sender: client?.id, message: createChatDto });
  }

  afterInit(client: Socket) {
    Logger.log('Socket init');
    client.use((socket, next) => wsAuthMiddleware(socket, next));
  }
}
