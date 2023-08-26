import { Body, Controller, Get, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import console from 'console';
import { UserService } from '../user/user.service';
import { Chat, ChatMessage } from './chat.entity';
import { ChatService } from './chat.service';
import { messageDto } from './messageDto.dto';
import { roomDto } from './roomDto.dto ';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guard/auth.guard';
import { User } from '../user/user.entity';

//TODO SETPASSWORD
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}
    
	@Post('allAdmins')
    async getAdmins(@Body() roomInfos: roomDto)
	{
		console.log("allAdmins")
		return (await this.chatService.getAdmins(roomInfos.id));
	}
    @Post('allBans')
    async getBans(@Body() roomInfos: roomDto)
	{
		console.log("allBans")
		return (await this.chatService.getBans(roomInfos.id));
	}

	@Post('owner')
    async getOwner(@Body() roomInfos: roomDto)
	{
		console.log("getOwner");
		return (await this.chatService.getOwner(roomInfos.id));
	}

	@UseGuards(AuthGuard)
    @Post('message')
    async postMessage(@Request() req: any, @Body() messageInfos: messageDto, @Res() res: any)//TODO CHECK IF IS CHATTER NOT BAN NOR MUTED
    {
        console.log("POSTMESSAGE");
		const roomId: string = messageInfos.roomId
		const user : User = await this.userService.findOne(req.user);

        const message : ChatMessage = new ChatMessage;
        message.message = messageInfos.message;
		message.user = user;
		
		if (!user)
		{
            res.status(409).json({"error": "unknown user"}).send();
		}
        else if (await this.chatService.isBan(roomId, user) || await this.chatService.isMute(roomId, user))
        {
            res.status(403).json({"error":"Forbidden"}).send();
        }
        else if (await this.chatService.isAdmin(roomId, user) 
            || await this.chatService.isOwner(roomId, user) 
            || await this.chatService.isChatter(roomId, user))
        {
        	if (await this.chatService.addMessage(messageInfos.roomId, message))
  		    	await res.status(200).json({"status":"good"}).send();
			else
            	res.status(409).json({"error":"no chat with that id"}).send();
        }
        else
            res.status(403).json({"error":"Forbidden"}).send();
		return ;
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAll(@Request() req: any) 
    {
        console.log("ALL");
        return (await this.chatService.findAll(req.user));
    }

    @UseGuards(AuthGuard)
    @Get('room:roomId')
    async getMessages(@Request() req: any, @Param() params: any, @Res() res: any)
    {
    
        const roomId: string = params.roomId.slice(1);
		const user : User = await this.userService.findOne(req.user);
		if (!user)
		{
            res.status(409).json({"error": "unknown user"}).send();
		}
        //is user ban
        else if (await this.chatService.isBan(roomId, user))
        {
            res.status(403).json({"error":"Forbidden"}).send();
        }
        else if (await this.chatService.isAdmin(roomId, user) 
            || await this.chatService.isOwner(roomId, user) 
            || await this.chatService.isChatter(roomId, user))
        {
        //is user a chatter/owner/admin
            console.log("getMessage " + roomId);
            // console.log((await this.chatService.getMessagesByRoom(roomId)));
        	res.status(200).json(await this.chatService.getMessagesByRoom(roomId)).send();
        }
        else
            await res.status(403).json({"error":"Forbidden"}).send();
		return ;
    }
   
//TODO CHECK TOKEN TO GET THE RIGHT USER AND CHECK IF UER IS OWNER IN DELETE
	@UseGuards(AuthGuard)
    @Post('create')
    async createRoom(@Body() roomInfos: roomDto, @Request() req: any, @Res() res: any)
    {
        console.log("CREATE");
        const chat : Chat = new Chat;
        chat.messages =  [];
        chat.owner = await this.userService.findOne(req.user);
        chat.id = roomInfos.id;
        if (roomInfos.password)
		{
            const hash = await bcrypt.hash(roomInfos.password, 10);
            chat.password = hash;
        }
		if (!(await this.chatService.findOne(roomInfos.id)))
		{
        	this.chatService.createRoom(chat);
        	await res.status(200).json({"status":"good"}).send();
		
		}
		else
        {
            await res.status(409).json({"error":"chat id already taken"}).send();
        }
            return;
    }

	@UseGuards(AuthGuard)
    @Post('delete')
    async DeleteRoom(@Body() roomInfos: roomDto, @Request() req: any, @Res() res: any)
    {
        console.log("DELETE");
		if (this.chatService.isOwner(roomInfos.id, req.user))
		{
			const chat = await this.chatService.findOne(roomInfos.id);
			if (!chat)
			{    
				res.status(409).json({"error":"no chat with that id"}).send();
				return ;
			}
			console.log(chat);
			if (chat.password)
			{
			if (!await this.chatService.verifyPassword(roomInfos.id, roomInfos.password))
			{
				await res.status(403).json({"error":"Forbidden"}).send();
				return;
			}
			}
			await this.chatService.deleteRoom(chat.id);
			await res.status(200).json({"status":"good"}).send();
			console.log("yo");
		}
		else
			await res.status(403).json({"error":"Forbidden"}).send();
		
		return;
    } 

	@UseGuards(AuthGuard)
	@Post('addAdmin')
	async addAdmin(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            await res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        if (!body['newAdmin'])
        {
            await res.status(400).json({"error":"Bad Request"}).send();
            return;
        }
        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
        //create the user object to add
		console.log("addAdmin");
		const newAdmin: User = await this.userService.findOne(body['newAdmin']);

		console.log(newAdmin)

        //check is the User exist
        if (!newAdmin)
        {
 			await res.status(409).json({"error":"no user with that id"}).send();
            return;
        }

		await this.chatService.addAdmin(roomId, newAdmin);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delAdmin') 
    async delAdmin(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delAdmin");
        console.log(body['admin'])

		await this.chatService.removeAdmin(roomId, body['admin']);
        await res.status(200).json({"status":"good"}).send();
        return;
	}
    
	@UseGuards(AuthGuard)
	@Post('addBan')
	async addBan(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        if (!body['newBan'])
        {
            res.status(400).json({"error":"Bad Request"}).send();
            return;
        }
        //create the user object to add
		console.log("addBan");
        //check is the User exist
		const newBan: User = await this.userService.findOne(body['newBan']);
        if (!newBan)
        {
            res.status(409).json({"error":"no user with that id"}).send();
            return;
        }

        //check if user is owner or ban
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)) || (await this.chatService.isOwner(roomId, newBan)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		await this.chatService.addBan(roomId, newBan);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delBan') 
    async delBan(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        //check if user is owner or ban
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delBan");
        console.log(body['ban'])

		await this.chatService.removeBan(roomId, body['ban']);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

	@UseGuards(AuthGuard)
	@Post('addMute')
	async addMute(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        if (!body['newMute'])
        {
            res.status(400).json({"error":"Bad Request"}).send();
            return;
        }
        //create the user object to add
		console.log("addMute");
		const newMute: User = await this.userService.findOne(body['newMute']);
		// console.log(newMute)
        //check is the User exist
        if (!newMute)
        {
            res.status(409).json({"error":"no user with that id"}).send();
            return;
        }
        //check if user is owner or mute
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)) || (await this.chatService.isOwner(roomId, newMute)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }

		await this.chatService.addMute(roomId, newMute);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delMute') 
    async delMute(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        //check if user is owner or mute
        const agent: User | null = (await this.userService.findOne(req.user));
        // if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isMute(roomId, agent)))
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delMute");
        console.log(body['mute'])

		await this.chatService.removeMute(roomId, body['mute']);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

	@UseGuards(AuthGuard)
	@Post('addChatter')
	async addChatter(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        if (!body['newChatter'])
        {
            res.status(400).json({"error":"Bad Request"}).send();
            return;
        }
        //check if user is owner or chatter
        const agent: User | null = (await this.userService.findOne(req.user));
        // if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isChatter(roomId, agent)))
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
        //create the user object to add
		console.log("addChatter");
		const newChatter: User = await this.userService.findOne(body['newChatter']);

		console.log(newChatter)

        //check is the User exist
        if (!newChatter)
        {
            res.status(409).json({"error":"no user with that id"}).send();
            return;
        }

		await this.chatService.addChatter(roomId, newChatter);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delChatter') 
    async delChatter(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: string = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        //check if user is owner or chatter
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delChatter");
        console.log(body['chatter'])

		await this.chatService.removeChatter(roomId, body['chatter']);
        await res.status(200).json({"status":"good"}).send();
        return;
	}
}
