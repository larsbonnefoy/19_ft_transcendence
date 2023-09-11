import { Body, Controller, Get, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import console from 'console';
import { UserService } from '../user/user.service';
import { Chat, ChatMessage } from './chat.entity';
import { ChatService } from './chat.service';
import { messageDto } from './messageDto.dto';
import { roomDto } from './roomDto.dto ';
import * as bcrypt from 'bcrypt';
// import * as bcrypt from 'bcryptjs';
import { AuthGuard } from '../guard/auth.guard';
import { User } from '../user/user.entity';

class timeOut{
    public chatId: number
    public userId: string
    public startTime: number = new Date().getTime()
}

let muteArray: Array<timeOut> = new Array(0);
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
    @Post('joinChannel')
    async joinChannel(@Request() req: any, @Body() roomInfos: roomDto, @Res() res: any)
    {
        console.log("join channel: " + roomInfos.id + " " + roomInfos.password);
        console.log(roomInfos.password)
        const chat: Chat = await this.chatService.findOne(roomInfos.id);
        if (!chat)
        {
            res.status(409).json({"error": "Chat not found"}).send();
            return; 
        }
        if (chat.password)
        {
            const result = await this.chatService.verifyPassword(roomInfos.id, roomInfos.password)
            if (!result)
            {
                 res.status(401).json({"error": "Bad Password"});
                return; 
            }
        }
        const user = await this.userService.findOne(req.user);
        if (!user)
        {
            res.status(409).json({"error": "unknown user"}).send();
            return; 
        }
        if (await this.chatService.isBan(roomInfos.id, user))
        {
            res.status(403).json({"error": "You are Banned"}).send();
            return; 
        }
        if (await this.chatService.isOwner(roomInfos.id, user) || await this.chatService.isAdmin(roomInfos.id, user) || await this.chatService.isChatter(roomInfos.id, user))
        {
            res.status(403).json({"error": "Already in the channel"}).send();
            return; 
        }
        await this.chatService.addChatter(roomInfos.id, user);
        res.status(200).json({"status": "good"});
    }

	@UseGuards(AuthGuard)
    @Post('message')
    async postMessage(@Request() req: any, @Body() messageInfos: messageDto, @Res() res: any)//TODO CHECK IF IS CHATTER NOT BAN NOR MUTED
    {
        console.log("POSTMESSAGE");
		const roomId: number = messageInfos.roomId
		const user : User = await this.userService.findOne(req.user);

        const message : ChatMessage = new ChatMessage;
        message.message = messageInfos.message;
		message.user = user;
		
		if (!user)
		{
            res.status(409).json({"error": "unknown user"}).send();
		}
        else if (await this.chatService.isBan(roomId, user) )
        {
            res.status(403).json({"error":"Forbidden"}).send();
        }
        else if (await this.chatService.isMute(roomId, user))
        {
            const mute: timeOut | undefined = muteArray.find((it) => {
                return it.chatId === roomId && it.userId === req.user
            })
            if (mute)
            {
                if (new Date().getTime() - mute.startTime > 30000)
                {
                    const index: number = muteArray.findIndex((it) =>{
                        return it.chatId === roomId && it.userId === req.user
                    })
                    let newMuteArray: Array<timeOut> = new Array(0);
                    let i: number = 0;
                    for (let mute of muteArray)
                    {
                        if (i !== index)
                            newMuteArray.push(mute);
                        i++;
                    }
                    muteArray = newMuteArray;
		            await this.chatService.removeMute(roomId, mute.userId);
                }
            }
            
            res.status(403).json({"error":"Forbidden"}).send();
        }
        else if (await this.chatService.isAdmin(roomId, user) 
            || await this.chatService.isOwner(roomId, user) 
            || await this.chatService.isChatter(roomId, user))
        {
        	if (await this.chatService.addMessage(messageInfos.roomId, message))
  		    	await res.status(200).json(message).send();
			else
            	res.status(409).json({"error":"no chat with that id"}).send();
        }
        else
            res.status(403).json({"error":"Forbidden"}).send();
		return ;
    }



    @UseGuards(AuthGuard)
    @Get('public')
    async getPublic(@Request() req: any)
    {
        console.log("PUBLIC");
        return (await this.chatService.findPublic(req.user));
    }

    @UseGuards(AuthGuard)
    @Post('hasPass')
    async hasPass(@Request() req: any, @Body() body: string)
    {
        console.log("hasPass");
        return (await this.chatService.hasPass(body['id']));
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAll(@Request() req: any) 
    {
        console.log("ALL");
        return (await this.chatService.findAll(req.user));
    }

    @UseGuards(AuthGuard)
    @Post('getDmWith')
    async getDmWith(@Request() req: any, @Body() body: string) 
    {
        console.log("getDmWith");
        return (await this.chatService.getDmWith(req.user, body['target']));
    }

    @UseGuards(AuthGuard)
    @Post('getMessages')
    async getMessages(@Request() req: any, @Body() body: roomDto, @Res({ passthrough: true }) res: any)
    {
        console.log("GETEMESSAGE");
        // console.log(body)
        const roomId: number = body.id;
        // console.log("getMessage: " + roomId);
		const user : User = await this.userService.findOne(req.user);
		if (!user)
		{
            res.status(409).json({"error": "unknown user"}).send();
            return;
		}
        else if (await this.chatService.isBan(roomId, user))
        {
            res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
        else if (await this.chatService.isAdmin(roomId, user) 
            || await this.chatService.isOwner(roomId, user) 
            || await this.chatService.isChatter(roomId, user))
        {
            let messages : ChatMessage[] = [];    
            const tmp: ChatMessage[] | null = (await this.chatService.getMessagesByRoom(roomId)); 
            // console.log(tmp);
            // console.log("yoo: " );
            // console.log(user.blocked_users);
		    for (let message  of tmp) {
			    if (!user.blocked_users.find((it) =>{return (it === message.user.login42)}))
                {
				    messages.push(message)
                }
            }

            // console.log(messages);
            
            res.status(200).json(messages).send();
            return;
        }
        else
            await res.status(403).json({"error":"Forbidden"}).send();
		return;
    }
   
	@UseGuards(AuthGuard)
    @Post('create')
    async createRoom(@Body() roomInfos: roomDto, @Request() req: any, @Res() res: any)
    {
        console.log("CREATE");
        console.log(roomInfos.isDm)
        const chat : Chat = new Chat;
        chat.messages =  [];
        chat.owner = await this.userService.findOne(req.user);
        if (roomInfos.isDm)
        {
            if (!await this.chatService.getDmWith(req.user, roomInfos.usernames[0])) 
                chat.name = req.user + " " + roomInfos.usernames[0];
            else
            {
        	    await res.status(409).json('{error: already exist}').send();
                return ;
            }
        }
        else
            chat.name = roomInfos.name;
        chat.isDm = roomInfos.isDm;
        chat.isPrivate = roomInfos.isPrivate;
        if (roomInfos.password)
		{
            const hash = await bcrypt.hash(roomInfos.password, 10);
            chat.password = hash;
        }
		// if (!(await this.chatService.findOne(roomInfos.name)))
		// {
        	await this.chatService.createRoom(chat);
            for(const username of roomInfos.usernames)
            {
                console.log(username);
                try
                {
		            const newChatter: User = await this.userService.findUsername(username);
                    await this.chatService.addChatter(chat.id, newChatter);
                }
                catch
                {

                }
            }
           chat.chatters = await this.chatService.getChatters(chat.id);
        	await res.status(200).json(chat).send();
		// }
		// else
        // {
            // await res.status(409).json({"error":"chat id already taken"}).send();
        // }
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
        const roomId: number = body['id'];
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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getAdmins(body['id'])).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delOwner') 
    async delOwner(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delOwner");

		await this.chatService.removeOwner(roomId);
        await res.status(200).json(await this.chatService.getOwner(body['id'])).send();

        return;
	}    


    @UseGuards(AuthGuard)
	@Post('changeName') 
    async changeName(@Res() res: any, @Body() body: roomDto, @Request() req: any)
	{
        //get room id
        const roomId: number = body.id;
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) )
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		await this.chatService.setName(roomId, body.name);
        await res.status(200).json(body.name).send();
        return;
	}
    
    @UseGuards(AuthGuard)
	@Post('removePassword') 
    async removePassword(@Res() res: any, @Body() body: roomDto, @Request() req: any)
	{
        //get room id
        const roomId: number = body.id;
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) )
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		await this.chatService.removePassword(roomId);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('changePassword') 
    async changePassword(@Res() res: any, @Body() body: roomDto, @Request() req: any)
	{
        //get room id
        const roomId: number = body.id;
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }
        //check if user is owner or admin
        const agent: User | null = (await this.userService.findOne(req.user));
        if (!(await this.chatService.isOwner(roomId, agent)) )
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		await this.chatService.setPassword(roomId, body.password);
        await res.status(200).json({"status":"good"}).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delAdmin') 
    async delAdmin(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getAdmins(body['id'])).send();

        return;
	}
    
	@UseGuards(AuthGuard)
	@Post('addBan')
	async addBan(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getBans(body['id'])).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delBan') 
    async delBan(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getBans(body['id'])).send();
        return;
	}

@UseGuards(AuthGuard)
	@Post('addMute')
	async addMute(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const start: number = new Date().getTime();
        const roomId: number = body['id'];
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
        const mute : timeOut = new timeOut;
        mute.chatId = roomId;
        mute.userId = newMute.login42;
        muteArray.push(mute);
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getMutes(body['id'])).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delMute') 
    async delMute(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
        const index: number = muteArray.findIndex((it) =>{
            return it.chatId === roomId && it.userId === req.user
        })
        let newMuteArray: Array<timeOut> = new Array(0);
        let i: number = 0;
        for (let mute of muteArray)
        {
            if (i !== index)
                newMuteArray.push(mute);
            i++;
        }
        muteArray = newMuteArray;

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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getMutes(body['id'])).send();
        return;
	}

	@UseGuards(AuthGuard)
	@Post('addChatter')
	async addChatter(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
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
        if (!agent)
        {
           res.status(409).json({"error":"Unknown User"}).send();
            return;
        }
        // if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isChatter(roomId, agent)))
        if (!(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)) || (await this.chatService.isBan(roomId, body['newChatter'])))
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
        // await res.status(200).json({"status":"good"}).send();
        await res.status(200).json(await this.chatService.getChatters(body['id'])).send();
        return;
	}

    @UseGuards(AuthGuard)
	@Post('delChatter') 
    async delChatter(@Res() res: any, @Body() body: string, @Request() req: any)
	{
        //get room id
        const roomId: number = body['id'];
        console.log("delChatter")
        if (!(await this.chatService.findOne(roomId)))
        {
            res.status(409).json({"error":"no chat room with that id"}).send();
            return;
        }

        //check if user is owner or chatter
        const agent: User | null = (await this.userService.findOne(req.user));
        if (body['chatter'] !== req.user && !(await this.chatService.isOwner(roomId, agent)) && !(await this.chatService.isAdmin(roomId, agent)))
        {
            await res.status(403).json({"error":"Forbidden"}).send();
            return;
        }
		console.log("delChatter");
        console.log(body['chatter'])

		await this.chatService.removeChatter(roomId, body['chatter']);
        await res.status(200).json(await this.chatService.getChatters(body['id'])).send();
        return;
	}

  @Get('delAll')
  async delAll(@Res() res: any) {
    const chats = await this.chatService.all();
    for (let chat of chats) {
      await this.chatService.deleteRoom(chat.id);
    }
    res.json({"all chats":"deleted"});
  }
  
}
