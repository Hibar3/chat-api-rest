import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { GetChatDto } from 'src/chats/dto/get-chat.dto';
import { ChatsService } from 'src/chats/chats.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly repo: RoomsService,
    private readonly chatsService: ChatsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return this.repo.create(req.user._id.toString(), createRoomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Request() req) {
    return this.repo.findAll();
  }

  /** get user's active rooms only */
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyRooms(@Request() req) {
    return this.repo.getMyRooms(req?.user._id.toString()); // only get rooms current user belongs to
  }

  /** get user's current rooms with target recipient only */
  @Get(':id/current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  getCurrentRoom(@Request() req, @Param('id') recipientId) {
    return this.repo.getCurrentRoom(req?.user._id.toString(), recipientId); // only get rooms current user belongs to
  }

  @Get(':id/chats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  getChats(@Param('id') id, @Query() dto: GetChatDto) {
    return this.chatsService.findAll(id, new GetChatDto(dto));
  }
}
