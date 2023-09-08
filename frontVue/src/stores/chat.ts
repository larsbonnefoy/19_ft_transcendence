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
       async  unsetChannel()
       {
        this.channel = null;
       },

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
                this.chat = {ChannelList: []};
                this.chat.ChannelList = data.data;
                console.log("hmmmmm " + data.data[0].id)
            }
            catch (error)
            {
                console.log("Error: FetchChannels: " + error)
                // this.chat = Array<Channel>;
                this.chat = {ChannelList: []};
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