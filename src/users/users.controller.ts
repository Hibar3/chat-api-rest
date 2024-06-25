import { Controller, Body, Patch, Request, UseGuards, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User, UserDocument } from './schemas/user.schemas';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user._id.toString(), updateUserDto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  get(@Request() req, @Param() user: User) {
    return this.usersService.find(user);
  }
}
