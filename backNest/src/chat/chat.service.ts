import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService 
{
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
	) {}
	
	async createRoom(chat: Chat): Promise<Chat>
	{
		return await this.chatRepository.save(chat);
	}

	async deleteRoom(id: string)
	{
		 await this.chatRepository.delete(id);
	}

	async setPassword(roomId: string, pass: string)
	{
		const hash = await bcrypt.hash(pass, 10);
		await this.chatRepository.update(roomId, {password: hash});
	}

	async verifyPassword(roomId: string, pass: string)
	{
		return (await bcrypt.compare(pass, ((await this.chatRepository.findOneBy({ id: roomId})).password)))
	}
}
