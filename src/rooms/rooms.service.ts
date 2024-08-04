import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schemas';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(userId: string, createRoomDto: CreateRoomDto) {
    createRoomDto.members.push(userId);
    const createdRoom = new this.roomModel(createRoomDto);
    return await createdRoom.save();
  }

  async findAll() {
    return await this.roomModel.find();
  }

  async getMyRooms(userId: string) {
    return await this.roomModel.find({ members: userId }).exec();
  }

  async getCurrentRoom(userId: string, recipientId: string) {
    try {
      const res = await this.roomModel
        .find({ members: userId && recipientId })
        .exec();

      // re-map values to return only roomId
      return res.map((item) => ({
        roomId: item._id,
      }));
    } catch (error) {
      throw new NotFoundException(
        `Can't find chatroom for user ${userId} and ${recipientId}`,
      );
    }
  }
}
