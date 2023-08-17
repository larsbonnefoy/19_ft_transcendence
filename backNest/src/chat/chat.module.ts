import { Module } from '@nestjs/common';
import { ChatMessage } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { chatDatabaseProviders } from './chatDatabase.providers';

@Module({
  	imports: [TypeOrmModule.forFeature([ChatMessage])],
})

export class ChatModule {}
