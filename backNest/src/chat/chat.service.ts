import { flatten, Injectable } from '@nestjs/common';
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
	async all(): Promise<Chat[]>
	{
		return this.chatRepository.find();
	}
   	async findAll(login42: string): Promise<Chat[]>
   	{
    	// return this.chatRepository.find();
		const tmp: Chat[] = [];
		const chats : Chat[] = tmp.concat(await this.chatRepository.find({ relations: {owner: true, chatters: true, admins: true}, where: {owner: {login42: login42}}, select: {id: true, name: true, owner: {login42: true}, isDm: true, chatters: {login42: true}, admins: {login42: true}}})
			,(await this.chatRepository.find({ relations: {owner: true, chatters: true, admins: true}, where: {admins: {login42: login42}}, select: { id: true, name: true,admins: {login42: true}, isDm: true, chatters: {login42: true}, owner: {login42: true}}}))
			,(await this.chatRepository.find({ relations: {owner: true, chatters: true, admins: true}, where: {chatters: {login42: login42}}, select : {id: true, name: true, chatters: {login42: true}, isDm: true, owner: {login42: true}, admins: {login42: true}}})));
		return chats;
 	}

  	findOne(roomId: number): Promise<Chat | null> {	
   	 	return this.chatRepository.findOneBy({id: roomId});
  	}

	async getOwner(roomId: number) : Promise<User | null>
	{
		const owner: User | null = await this.userRepository.findOne({ relations: {owned: true},  where: { owned: {id: roomId}}})	
		return owner; 
	}
	
	async getChatters(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {chats: true},  where: { chats: {id: roomId}}})
	}

	async getBans(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {banned: true},  where: { banned: {id: roomId}}});
	}

	async getMutes(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {muted: true},  where: { muted: {id: roomId}}});
	}

	async getAdmins(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {administered: true},  where: { administered: {id: roomId}}});
	}

	async getMessagesByRoom(roomId: number) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({ relations: {chat: true, user: true },  where: { chat: {id: roomId}}, select : {id: true, time: true, message: true, chat: {id: true, name: true}, user: {login42: true, username: true, blocked_users: true, photo: true}}});
	}
	
	async getMessagesByUser(userId: string) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({ relations: {user: true, chat: true},  where: { user: {login42: userId}}})
	}

	// Checkers

	async	isOwner(roomId: number, user: User) : Promise<boolean>
	{
		console.log("isOwner");
		const owner: User | null = await this.getOwner(roomId);
		console.log(owner);
		console.log(user)
		if (!owner || owner.login42 !== user.login42)
		{
			console.log("false");
			return false
		}
		return (true);
	}

	async isAdmin(roomId: number, user: User) : Promise<boolean>
	{
		console.log("isAdmin");
		const admins: User[] = await this.getAdmins(roomId);
		if (!admins || !admins.find(it => { return it.login42 === user.login42}))
		{
			console.log("false");
			return false;
		}
		return true;
	}

	async isChatter(roomId: number, user: User) : Promise<boolean>
	{
		console.log("isChatter");
		const chatters: User[] = await this.getChatters(roomId);
		if (!chatters || !chatters.find(it => { return it.login42 === user.login42}))
		{
			console.log("false");
			return false;
		}
		return true;
	}

	async isMute(roomId: number, user: User) : Promise<boolean>
	{
		console.log("isMute");
		const mutes: User[] = await this.getMutes(roomId);
		if (!mutes || !mutes.find(it => { return it.login42 === user.login42}))
		{
			console.log("false");
			return false;
		}
		return true;
	}

	async isBan(roomId: number, user: User) : Promise<boolean>
	{
		console.log("isBan");
		const bans: User[] = await this.getBans(roomId);
		if (!bans || !bans.find(it => { return it.login42 === user.login42}))
		{
			console.log("false");
			return false;
		}
		return true;
	}

	// room management
	async createRoom(chat: Chat): Promise<Chat>
	{
		return await this.chatRepository.save(chat);
	}

	async deleteRoom(id: number)
	{
		 await this.chatRepository.delete(id);
		 return ;
	}

	async setPassword(roomId: number, pass: string)
	{
		const hash = await bcrypt.hash(pass, 10);
		await this.chatRepository.update(roomId, {password: hash});
	}

	async removePassword(roomId: number)
	{
		await this.chatRepository.update(roomId, {password: null});
	}

	async verifyPassword(roomId: number, pass: string)
	{
		return (await bcrypt.compare(pass, ((await this.chatRepository.findOneBy({ id: roomId})).password)))
	}

	// User management
	async setOwner(roomId: number, user: User)
	{
		await this.chatRepository.update(roomId, {owner: user})
	}

	async addAdmin(roomId: number, newAdmin: User)
	{
		const admins: User[] = await this.getAdmins(roomId);
		admins.push(newAdmin);
		const chat : Chat = await this.findOne(roomId);
		chat.admins= admins;
		await this.chatRepository.save(chat);
	}

	
	async addChatter(roomId: number, newChatter: User)
	{
		const chatters: User[] = await this.getChatters(roomId);
		chatters.push(newChatter);
		const chat : Chat = await this.findOne(roomId);
		chat.chatters = chatters;
		await this.chatRepository.save(chat);

	}

	async addMute(roomId: number, newMute: User)
	{
		const mutes: User[] = await this.getMutes(roomId);
		mutes.push(newMute);
		const chat : Chat = await this.findOne(roomId);
		chat.mutes= mutes;
		await this.chatRepository.save(chat);
	}


	async addBan(roomId: number, newBan: User)
	{
		const bans: User[] = await this.getBans(roomId);
		bans.push(newBan);
		const chat : Chat = await this.findOne(roomId);
		chat.bans= bans;
		await this.chatRepository.save(chat);
	}

	async removeAdmin(roomId : number, adminId: string)
	{
		const admins = await this.getAdmins(roomId);
		const index: number = admins.findIndex(it => { return it.login42 === adminId})
		if (index >= 0)
		{
			const newAdminsLeft = admins.slice(0, index);
			const newAdminsRight = admins.slice(index + 1);
			const newAdmins = newAdminsLeft.concat(newAdminsRight);
			
			const chat : Chat = await this.findOne(roomId);
			chat.admins = newAdmins;
			await this.chatRepository.save(chat);
		}
	}

	async removeChatter(roomId : number, chatterId: string)
	{
		const chatters = await this.getChatters(roomId);
		const index: number = chatters.findIndex(it => { return it.login42 === chatterId})
		if (index >= 0)
		{
			const newChattersLeft = chatters.slice(0, index);
			const newChattersRight = chatters.slice(index + 1);
			const newChatters = newChattersLeft.concat(newChattersRight);
			
			const chat : Chat = await this.findOne(roomId);
			chat.chatters = newChatters;
			await this.chatRepository.save(chat);
		}
	}

	async removeBan(roomId : number, banId: string)
	{
		const bans = await this.getBans(roomId);
		const index: number = bans.findIndex(it => { return it.login42 === banId})
		if (index >= 0)
		{
			const newBansLeft = bans.slice(0, index);
			const newBansRight = bans.slice(index + 1);
			const newBans = newBansLeft.concat(newBansRight);
			
			const chat : Chat = await this.findOne(roomId);
			chat.bans = newBans;
			await this.chatRepository.save(chat);
		}
	}

	async removeMute(roomId : number, muteId: string)
	{
		const mutes = await this.getMutes(roomId);
		const index: number = mutes.findIndex(it => { return it.login42 === muteId})
		if (index >= 0)
		{
			const newMutesLeft = mutes.slice(0, index);
			const newMutesRight = mutes.slice(index + 1);
			const newMutes = newMutesLeft.concat(newMutesRight);
			
			const chat : Chat = await this.findOne(roomId);
			chat.mutes = newMutes;
			await this.chatRepository.save(chat);
		}
	}

	// Message Management 

	async addMessage(roomId: number, newMessage: ChatMessage): Promise<boolean>
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
