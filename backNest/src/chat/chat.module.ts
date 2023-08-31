import { Module } from '@nestjs/common';
import { ChatMessage, Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { chatDatabaseProviders } from './chatDatabase.providers';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { Api42Module } from '../api42/api42.module';
import { User } from '../user/user.entity';

@Module({
  	imports: [TypeOrmModule.forFeature([ChatMessage, Chat, User]), UserModule, Api42Module],
  	providers: [ChatService],
	exports: [ChatService],
	controllers: [ChatController]
})

export class ChatModule {}
