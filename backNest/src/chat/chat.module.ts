import { Module } from '@nestjs/common';
import { ChatMessage, Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { chatDatabaseProviders } from './chatDatabase.providers';
import { ChatService } from './chat.service';

@Module({
  	imports: [TypeOrmModule.forFeature([ChatMessage, Chat])],
  	providers: [ChatService],
	exports: [ChatService]
})

export class ChatModule {}
