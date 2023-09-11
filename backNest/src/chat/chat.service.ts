import { flatten, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatMessage } from './chat.entity';
import {Not, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
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

	async getDmWith(me: string, target: string) : Promise<Chat | null>
	{
		const chats1 = await this.chatRepository.find({
			relations: {chatters: true, owner: true},
			where: {chatters: {login42: me}, isDm: true},
			select: {owner: {login42: true}}
		});
		const chats2 = await this.chatRepository.find({
			relations: {chatters: true, owner: true},
			where: {chatters: {login42: target}, isDm: true},
			select: {owner: {login42: true}}
		});
		// console.log(chats1);
		// console.log(chats2);
		const chat1 = chats1.find((it)=> {return (it.owner.login42 === target)})
		const chat2 = chats2.find((it)=> {return (it.owner.login42 === me)})
		// console.log(chat1);
		// console.log(chat2);
		if (chat1)	
			return chat1;
		if (chat2)	
			return chat2;
		return null
	}
   	async findPublic(login42: string): Promise<Chat[]>
   	{
    	// return this.chatRepository.find();
		const chats: Chat[] = [];
		const tmp : Chat[] = await this.chatRepository.find({order: {id: "ASC"}, relations: {owner: true, chatters: true, admins: true},
											where: {
												isPrivate: false, isDm: false, owner: {login42: Not(login42)}
											},
											select: {
													id: true, name: true,
													owner: {login42: true, username: true, photo: true},
													isDm: true,
													isPrivate: true, 
													chatters: {login42: true, username: true, photo: true},
													admins: {login42: true, username: true, photo: true}
												}
											});
		for (let chat  of tmp) {
			if (!chat.chatters?.find((it) => {return (it.login42 === login42)})
				&& !chat.admins?.find((it) => {return (it.login42 === login42)})
				&& !chat.bans?.find((it) => {return (it.login42 === login42)}))
					chats.push(chat)
		}
		// console.log(chats)
		return chats;
 	}

	async findAll(login42: string): Promise<Chat[]>
	{
		// return this.chatRepository.find();
		const tmp: Chat[] = [];
		const chats : Chat[] = tmp.concat(await this.chatRepository.find({order: {id: "ASC"}, relations: {owner: true, chatters: true, admins: true}, where: {owner: {login42: login42}}, select: {id: true, name: true, owner: {login42: true, username: true, photo: true}, isDm: true, isPrivate: true, chatters: {login42: true, username: true, photo: true}, admins: {login42: true, username: true, photo: true}}})
			,(await this.chatRepository.find({order: {id: "ASC"}, relations: {owner: true, chatters: true, admins: true}, where: {admins: {login42: login42}}, select: { id: true, name: true,admins: {login42: true, username: true, photo: true}, isDm: true, isPrivate: true, chatters: {login42: true, username: true, photo: true}, owner: {login42: true, username: true, photo: true}}}))
			,(await this.chatRepository.find({order: {id: "ASC"}, relations: {owner: true, chatters: true, admins: true}, where: {chatters: {login42: login42}}, select : {id: true, name: true, chatters: {login42: true, username: true, photo: true}, isDm: true, isPrivate: true, owner: {login42: true, username: true, photo: true}, admins: {login42: true, username: true, photo: true}}})));
		return chats;
	}
	async getUsers(roomId: number)
	{
		let tmp: User[] = [];
		const chat: Chat =  await this.chatRepository.findOne({relations: {owner: true, chatters: true, admins: true, mutes: true}, where : {id: roomId}, select: {owner: {login42: true}, admins: {login42: true}, chatters: {login42: true}, mutes: {login42: true}}});
		// console.log(chat);
		const users : User[] = tmp.concat(chat.owner, chat.admins, chat.chatters);
		return (users);
	}
  	findOne(roomId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({relations: {owner: true, chatters: true, admins: true, mutes: true}, where : {id: roomId}, select: {owner: {login42: true}, admins: {login42: true}, chatters: {login42: true}, mutes: {login42: true}}});
  	}

	async getOwner(roomId: number) : Promise<User | null>
	{
		const owner: User | null = await this.userRepository.findOne({ relations: {owned: true},  where: { owned: {id: roomId}}, select: {login42: true, username: true, photo: true}})
		return owner; 
	}
	
	async getChatters(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {chats: true},  where: { chats: {id: roomId}}, select: {login42: true, username: true, photo: true}})
	}

	async getBans(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {banned: true},  where: { banned: {id: roomId}}, select: {login42: true, username: true, photo: true}});
	}

	async getMutes(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {muted: true},  where: { muted: {id: roomId}}, select: {login42: true, username: true, photo: true}});
	}

	async getAdmins(roomId: number) : Promise<User[] | null>
	{
		return await this.userRepository.find({ relations: {administered: true},  where: { administered: {id: roomId}}, select: {login42: true, username: true, photo: true}});
	}

	async getMessagesByRoom(roomId: number) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({order: {id: "ASC"}, relations: {chat: true, user: true },  where: { chat: {id: roomId}}, select : {id: true, time: true, message: true, chat: {id: true, name: true}, user: {login42: true, username: true, blocked_users: true, photo: true}}});
	}
	
	async getMessagesByUser(userId: string) : Promise<ChatMessage[] | null>
	{
		return await this.chatMessageRepository.find({ relations: {user: true, chat: true},  where: { user: {login42: userId}}})
	}

	// Checkers

	async	isOwner(roomId: number, user: User) : Promise<boolean>
	{
		// console.log("isOwner");
		const owner: User | null = await this.getOwner(roomId);
		if (!owner || owner.login42 !== user.login42)
		{
			// console.log("false");
			return false
		}
		return (true);
	}

	async isAdmin(roomId: number, user: User) : Promise<boolean>
	{
		// console.log("isAdmin");
		const admins: User[] = await this.getAdmins(roomId);
		if (!admins || !admins.find(it => { return it.login42 === user.login42}))
		{
			// console.log("false");
			return false;
		}
		return true;
	}

	async isChatter(roomId: number, user: User) : Promise<boolean>
	{
		// console.log("isChatter");
		const chatters: User[] = await this.getChatters(roomId);
		if (!chatters || !chatters.find(it => { return it.login42 === user.login42}))
		{
			// console.log("false");
			return false;
		}
		return true;
	}

	async isMute(roomId: number, user: User) : Promise<boolean>
	{
		// console.log("isMute");
		const mutes: User[] = await this.getMutes(roomId);
		if (!mutes || !mutes.find(it => { return it.login42 === user.login42}))
		{
			// console.log("false");
			return false;
		}
		return true;
	}

	async isBan(roomId: number, user: User) : Promise<boolean>
	{
		// console.log("isBan");
		const bans: User[] = await this.getBans(roomId);
		if (!bans || !bans.find(it => { return it.login42 === user.login42}))
		{
			// console.log("false");
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

	async setName(roomId: number, name: string)
	{
		await this.chatRepository.update(roomId, {name: name});
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

	async verifyPassword(roomId: number, pass: string) : Promise<boolean>
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

	async removeOwner(roomId : number)
	{
		const admins = await this.getAdmins(roomId);
		let newOwner: User;
		if (admins.length !== 0)
		{
			newOwner = admins[0]
			await this.removeAdmin(roomId, newOwner.login42)	
			const chat : Chat = await this.findOne(roomId);
			chat.owner = newOwner;
			await this.chatRepository.save(chat);
		}
		else
		{
			const chatters = await this.getChatters(roomId);
			if (chatters.length !== 0)
			{

			
				newOwner = chatters[0]
				await this.removeChatter(roomId, newOwner.login42)	
				const chat : Chat = await this.findOne(roomId);
				chat.owner = newOwner;
				await this.chatRepository.save(chat);
			}
			else
			{
				const messages = await this.getMessagesByRoom(roomId);
				for (let message of messages)
				{
		 			await this.chatMessageRepository.delete(message.id);
				}
				await this.deleteRoom(roomId);
			}
		}
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
		// console.log(chat);
		if (chat != null)
		{
			const messages: ChatMessage[] = await this.getMessagesByRoom(roomId);
			// console.log(messages);
			messages.push(newMessage);
			chat.messages = messages;
			await this.chatRepository.save(chat);
			return true;
		}
		return false;
	}
	async hasPass(id: number) : Promise<boolean>
	{
		const chat : Chat = await this.findOne(id);
		// console.log(chat?.password)
		if(chat?.password)
			return true;
		return false;
	}
}

