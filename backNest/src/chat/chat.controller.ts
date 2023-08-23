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

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}
    
	@UseGuards(AuthGuard)
    @Post('message')
    async postMessage(@Request() req: any, @Body() messageInfos: messageDto, @Res() res: any)
    {
        console.log("POSTMESSAGE");
        const message : ChatMessage = new ChatMessage;
        // message.chat = messageInfos.roomId;
		// message.user = await this.userService.findOne("hdelmas");
        message.message = messageInfos.message;
		message.user = await this.userService.findOne(req.user);
        if (await this.chatService.addMessage(messageInfos.roomId, message))
		{
  		    await res.status(200).json({"status":"good"}).send();
			return ;
		}
		else
		{    
            res.status(409).json({"error":"no chat with that id"}).send();
            return ;
        }
    }

    @Get('all')
    async getAll()
    {
        console.log("ALL");
        // return await this.chatService.getMessages("test");
		console.log(await this.chatService.getMessagesByUser("hdelmas"));
        return (await this.chatService.findAll());
    }

    @Get('room:roomId')
    async getMessages(@Param() params: any)
    {
        const roomId: string = params.roomId.slice(1);
		//TODO check for password and user 
        console.log("getMessage " + roomId);
		return (await this.chatService.getMessagesByRoom(roomId));
    }
   
	@Post('allAdmins')
    async getAdmins(@Body() roomInfos: roomDto)
	{
		console.log("allAdmins")
		return (await this.chatService.getAdmins(roomInfos.id));
	}

	@UseGuards(AuthGuard)
	@Post('addAdmin')
	async addAdmin(@Body() body: string, @Request() req: any)
	{
		console.log("addAdmin");
		const newAdmin: User = await this.userService.findOne(body['newAdmin']);
		console.log(newAdmin)
		this.chatService.addAdmin(body['id'], newAdmin);
	}

    @Post('create')
    async createRoom(@Body() roomInfos: roomDto, @Request() req: Request)
    {
        console.log("CREATE");
        const chat : Chat = new Chat;
        chat.messages =  [];
        chat.owner = await this.userService.findOne("hdelmas");
        chat.id = roomInfos.id;
        if (roomInfos.password)
		{
            const hash = await bcrypt.hash(roomInfos.password, 10);
            chat.password = hash;
        }
        this.chatService.createRoom(chat);
    }
    @Post('delete')
    async DeleteRoom(@Body() roomInfos: roomDto, @Request() req: Request, @Res() res: any)
    {
        console.log("DELETE");
        //TODO CHECK USER
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
        return;
    } 
}
