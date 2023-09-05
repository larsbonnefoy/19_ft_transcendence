import { defineStore } from 'pinia'
import axios from "axios"
import {type ChatInfo, type Channel, type Messages} from '../types' 
import StatusVue from '@/components/ProfileDisplay/Status.vue'


export const useChannelStore = defineStore('channel', {
    state: () => ({
        channel: null as Channel | null
    }),
    getters: {
        getId: (state) => state.channel?.id,
        getName: (state) => state.channel?.name,
        getMessages: (state) => state.channel?.messages,
        getChatters: (state) => state.channel?.chatters,
        getAdmins: (state) => state.channel?.admins,
        getBans: (state) => state.channel?.bans,
        getMutes: (state) => state.channel?.mutes,
        getOwner: (state) => state.channel?.owner,
        getIsDm: (state) => state.channel?.isDm,
        getIsPrivate: (state) => state.channel?.isPrivate,
    },
    actions: {
       async setChannel(newChannel: Channel)
       {
            this.channel = newChannel;
            console.log("set : " + this.channel?.id)
            try
            {
                const messages: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/getMessages`, {id: this.channel?.id},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                this.channel.messages = messages.data;
                // console.log("setChannel: " + this.channel.messages)
            }
            catch (error)
            {
                this.channel = null;
            }
       },

       async refreshMessages()
       {
            console.log("refresf : " + this.channel?.id)
            try
            {
                const messages: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/getMessages`, {id: this.channel?.id},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                if(this.channel !== null)
                    this.channel.messages = messages.data;
            }
            catch (error)
            {
            }
       },

       async addMessage(newMessageString: string)
       {
        try
        {
          console.log(this.channel?.id)
          const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/message`, {roomId: this.channel?.id, message: newMessageString},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
            console.log(data);
            const newMessage : Messages = data.data;
            console.log("addMessage")
            console.log(newMessage)
            await this.channel?.messages.push(newMessage);
        }
        catch
        {

        }
       },

       async addChatter(userId: string)
       {
        try
        {
          console.log(this.channel?.id)
          const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/addChatter`, {id: this.channel?.id, newChatter: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
            console.log(data);
            if(this.channel !== null)
                this.channel.chatters = data.data;
        }
        catch
        {

        }
       },

       async addAdmin(userId: string)
       {
        try
        {
          console.log(this.channel?.id)
          const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/addAdmin`, {id: this.channel?.id, newAdmin: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
            console.log(data);
            if(this.channel !== null)
                this.channel.admins = data.data;
        }
        catch
        {

        }
        },

        async addBan(userId: string)
        {
        try
        {
          console.log(this.channel?.id)
          const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/addBan`, {id: this.channel?.id, newBan: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
            console.log(data);
            if(this.channel !== null)
                this.channel.bans = data.data;
        }
        catch
        {

        }
        },

     async addMute(userId: string)
        {
        try
        {
          console.log(this.channel?.id)
          const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/addMute`, {id: this.channel?.id, newMute: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
            console.log(data);
            if(this.channel !== null)
                this.channel.mutes = data.data;
        }
        catch
        {

        }
        },

       async hasPassFromId(id: number)
       {
            const data: any = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/hasPass`, {id: id},
            {
                headers: 
                {
	                'token':localStorage.getItem('jwt_token')
	            }
            });
            return data.data;

       },

      async kickUser(userId: string, status: string)
       {
            console.log('kick', status)
        if(status === 'chatter')
        {
            console.log('chatter')
          console.log(this.channel?.id)
           const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/delChatter`, {id: this.channel?.id, chatter: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                console.log(data.data)
                if(this.channel !== null)
                    this.channel.chatters = data.data;
        }
        else if(status === 'admin')
        {
           const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/delAdmin`, {id: this.channel?.id, admin: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                if(this.channel !==null)
                {
                    this.channel.admins = data.data
                }
        }   
       },

       async removeUser(userId: string, status: string)
       {
            console.log('remove', status)
        if(status === 'chatter')
        {
            console.log('chatter')
          console.log(this.channel?.id)
           const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/delChatter`, {id: this.channel?.id, chatter: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                console.log(data.data)
                if(this.channel !== null)
                    this.channel.chatters = data.data;
        }
        else if(status === 'admin')
        {
           const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/delAdmin`, {id: this.channel?.id, admin: userId},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                if(this.channel !==null)
                {
                    this.channel.admins = data.data
                    await this.addChatter(userId);
                }
        }   
       },
       async promoteChatter(userId: string)
       {
            await this.removeUser(userId, 'chatter')
            await this.addAdmin(userId);
       },
    }
})

export const useChatStore = defineStore('chat', {
    state: () => ({
        // for data that is not yet loaded
        // user: null as UserInfo | null,
        chat: null as ChatInfo | null
        
    }),
    getters: {
        // getChat: (state): ChatInfo | null => state.chat,
        getChannels: (state) => state.chat?.ChannelList,
        getPublics: (state) => state.chat?.PublicList,
          },
    actions: {
        async fetchChannels() {
            try
            {
                const data: any = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/all`,
                {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                this.chat = {ChannelList: [], PublicList: []};
                this.chat.ChannelList = data.data;
                console.log("hmmmmm " + data.data[0].id);
                const dataPublic: any = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/public`,
                {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                console.log(dataPublic.data)
                this.chat.PublicList = dataPublic.data;
                console.log(this.chat.PublicList)
            }
            catch (error)
            {
                console.log("Error: FetchChannels: " + error)
                // this.chat = Array<Channel>;
                this.chat = {ChannelList: [], PublicList: []};
            }
        },

        async addChannel(name: string, pass: string | null, isDm: boolean, isPrivate: boolean, usernames: string[])
        {
            console.log("addChannel " + name + " " + pass + " " + isDm + " " + isPrivate);
            try
            {
	        	const res = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/create`, {name: name, password: pass, isDm: isDm, isPrivate: isPrivate, usernames: usernames}, 
                {
			        headers:
			        {
				    'token':localStorage.getItem('jwt_token')
			        }
		        })
                const newChannel : Channel = res.data;
                this.chat?.ChannelList.push(newChannel);
                return res;
        	}
            catch (error: any)
            {
                // console.log("Error: addChannels: " + error);
                return (error);
            }
        },
      },
      
  })