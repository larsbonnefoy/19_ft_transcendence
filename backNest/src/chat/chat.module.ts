import { forwardRef, Module } from '@nestjs/common';
import { ChatMessage, Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { chatDatabaseProviders } from './chatDatabase.providers';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { Api42Module } from '../api42/api42.module';
import { User } from '../user/user.entity';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  	imports: [TypeOrmModule.forFeature([ChatMessage, Chat, User]), UserModule, forwardRef(() => Api42Module)],
	controllers: [ChatController],
  	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})

export class ChatModule {}
