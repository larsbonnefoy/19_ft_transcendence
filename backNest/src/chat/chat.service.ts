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

		@InjectRepository(ChatMessage)
		private chatMessageRepository: Repository<ChatMessage>,
		
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}
	
	// Getter
   	findAll(): Promise<Chat[]>
   	{
    	return this.chatRepository.find();
 	  }

  	findOne(roomId: string): Promise<Chat | null> {	
   	 	return this.chatRepository.findOneBy({ id: roomId});
  	}

	async getOwner(roomId: string) : Promise<User | null>
	{
		return (await this.findOne(roomId)).owner
	}
	
	async getChatters(roomId: string) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {chats: true},  where: { chats: {id: roomId}}})
	}

	async getBans(roomId: string) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {banned: true},  where: { banned: {id: roomId}}})
	}

	async getMutes(roomId: string) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {muted: true},  where: { muted: {id: roomId}}})
	}

	async getAdmins(roomId: string) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {administered: true},  where: { administered: {id: roomId}}})
	}

	async getMessagesByRoom(roomId: string) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({ relations: {chat: true},  where: { chat: {id: roomId}}})
	}
	
	async getMessagesByUser(userId: string) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({ relations: {user: true},  where: { user: {login42: userId}}})
	}

	// room management
	async createRoom(chat: Chat): Promise<Chat>
	{
		return await this.chatRepository.save(chat);
	}

	async deleteRoom(id: string)
	{
		 await this.chatRepository.delete(id);
		 return ;
	}

	async setPassword(roomId: string, pass: string)
	{
		const hash = await bcrypt.hash(pass, 10);
		await this.chatRepository.update(roomId, {password: hash});
	}

	async removePassword(roomId: string, pass: string)
	{
		await this.chatRepository.update(roomId, {password: null});
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
		const admins: User[] = await this.getAdmins(roomId);
		admins.push(newAdmin);
		const chat : Chat = await this.findOne(roomId);
		chat.admins= admins;
		await this.chatRepository.save(chat);
	}

	
	async addChatters(roomId: string, newChatter: User)
	{
		const chatters: User[] = await this.getChatters(roomId);
		chatters.push(newChatter);
		const chat : Chat = await this.findOne(roomId);
		chat.chatters= chatters;
		await this.chatRepository.save(chat);

	}

	async addMute(roomId: string, newMute: User)
	{
		const mutes: User[] = await this.getMutes(roomId);
		mutes.push(newMute);
		const chat : Chat = await this.findOne(roomId);
		chat.mutes= mutes;
		await this.chatRepository.save(chat);
	}


	async addBan(roomId: string, newBan: User)
	{
		const bans: User[] = await this.getBans(roomId);
		bans.push(newBan);
		const chat : Chat = await this.findOne(roomId);
		chat.bans= bans;
		await this.chatRepository.save(chat);
	}
	// Message Management 

	async addMessage(roomId: string, newMessage: ChatMessage): Promise<boolean>
	{
		const chat: Chat = await this.findOne(roomId);
		console.log(chat);
		if (chat != null)
		{
			const messages: ChatMessage[] = await this.getMessagesByRoom(roomId);
			console.log(messages);
			messages.push(newMessage);
			chat.messages = messages;
			await this.chatRepository.save(chat);
			return true;
		}
		return false;
	}
}
