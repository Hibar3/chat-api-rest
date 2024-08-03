import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { InterestsModule } from './interests/interests.module';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ChatsModule } from './chats/chats.module';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './healthcheck/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot( 'mongodb://127.0.0.1:27017', {
      dbName: 'chat',
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '365d' || process.env.JWT_EXPIRATION }, // set default expirtation from env
    }),
    CommandModule,
    UsersModule,
    InterestsModule,
    AuthModule,
    RoomsModule,
    ChatsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
