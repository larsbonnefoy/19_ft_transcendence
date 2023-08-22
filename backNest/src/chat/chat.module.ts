import { Module } from '@nestjs/common';
import { ChatMessage, Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { chatDatabaseProviders } from './chatDatabase.providers';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';

@Module({
  	imports: [TypeOrmModule.forFeature([ChatMessage, Chat]), UserModule],
  	providers: [ChatService],
	exports: [ChatService],
	controllers: [ChatController]
})

export class ChatModule {}
