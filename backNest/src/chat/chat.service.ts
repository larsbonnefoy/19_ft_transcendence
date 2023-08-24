import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatMessage } from './chat.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class ChatService 
{
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
	) {}
	
	// Getter
   	findAll(): Promise<Chat[]>
   	{
    	return this.chatRepository.find();
 	  }

  	findOne(roomId: string): Promise<Chat | null> {	
   	 	return this.chatRepository.findOneBy({ id: roomId });
  	}

	async getOwner(roomId: string) : Promise<User | null>
	{
		return (await this.findOne(roomId)).owner
	}
	
	async getAdmins(roomId: string) : Promise<User[] | null>
	{
	    const room = await this.findOne(roomId)
		if ((room) != null)
			return room.admins;
		return null;
	}


	async getChatters(roomId: string) : Promise<User[] | null>
	{
	    const room = await this.findOne(roomId)
		if ((room) != null)
			return room.chatters;
		return null;
	}


	async getMutes(roomId: string) : Promise<User[] | null>
	{
	    const room = await this.findOne(roomId)
		if ((room) != null)
			return room.mutes;
		return null;
	}

	
	async getBans(roomId: string) : Promise<User[] | null>
	{
	    const room = await this.findOne(roomId)
		if ((room) != null)
			return room.bans;
		return null;
	}

	
	async getMessages(roomId: string) : Promise<ChatMessage[] | null>
	{
	    const room = await this.findOne(roomId)
		if ((room) != null)
			return room.messages;
		return null;
	}

	// room management
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

	// User management
	async setOwner(roomId: string, user: User)
	{
		await this.chatRepository.update(roomId, {owner: user})
	}

	async addAdmin(roomId: string, newAdmin: User)
	{
		let admins : User[] = await this.getAdmins(roomId);
		if (admins != null)
		{
			admins.push(newAdmin);
			await this.chatRepository.update(roomId, {admins: admins})
		}
		// else throw ?
	}

	
	async addchatter(roomId: string, newchatter: User)
	{
		let chatters : User[] = await this.getChatters(roomId);
		if (chatters != null)
		{
			chatters.push(newchatter);
			await this.chatRepository.update(roomId, {chatters: chatters})
		}
		// else throw ?
	}

	async addMute(roomId: string, newMute: User)
	{
		let mutes : User[] = await this.getMutes(roomId);
		if (mutes != null)
		{
			mutes.push(newMute);
			await this.chatRepository.update(roomId, {mutes: mutes})
		}
		// else throw ?
	}


	async addBan(roomId: string, newBan: User)
	{
		let bans : User[] = await this.getBans(roomId);
		if (bans != null)
		{
			bans.push(newBan);
			await this.chatRepository.update(roomId, {bans: bans})
		}
		// else throw ?
	}

	// Message Management 

	async addMessage(roomId: string, newMessage: ChatMessage)
	{
		const chat: Chat = await this.findOne(roomId);
		if (chat != null)
		{
			chat.messages.push(newMessage);
			// await this.chatRepository.update(roomId, {messages: messages})
			await this.chatRepository.save(chat);
		}
	}
}
