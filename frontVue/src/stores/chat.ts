import { defineStore } from 'pinia'
import axios from "axios"
import {type ChatInfo, type Channel, type Messages} from '../types' 
import StatusVue from '@/components/ProfileDisplay/Status.vue'


export const useChannelStore = defineStore('channel', {
    state: () => ({
        channel: null as Channel | null
    }),
    getter: {
        getId: (state) => state.channel?.id,
        getMessages: (state) => state.channel?.messages,
        getChatters: (state) => state.channel?.chatters,
        getAdmins: (state) => state.channel?.admins,
        getBans: (state) => state.channel?.bans,
        getMutes: (state) => state.channel?.mutes,
        getOwner: (state) => state.channel?.owner,
        getIsPrivate: (state) => state.channel?.isPrivate,
    },
    actions: {
       async setChannel(newChannel: Channel)
       {
            this.channel = newChannel;
            console.log(">>>>>>" + this.channel.id)
            try
            {
                const messages: any = await axios.post(`http://localhost:3000/chat/getMessages`, {id: this.channel?.id},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                console.log("hmmm a" + messages.data)
                this.channel.messages = messages.data;
                console.log("setChannel: " + this.channel.messages)
            }
            catch (error)
            {
                this.channel = null;
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
                const data: any = await axios.get('http://localhost:3000/chat/all',
                {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
                this.chat = []
                this.chat.ChannelList = data.data; 
                console.log(data.data[0].isPrivate)
            }
            catch (error)
            {
                console.log("Error: FetchChannels: " + error)
                this.chat = [];
            }
        },

        async addChannel(id: string, pass: string, status: boolean)
        {
            console.log("addChannel " + id + " " + pass + " " + status);
            try
	        {
	        	const res = await axios.post('http://localhost:3000/chat/create/', {id: id, password: pass, isPrivate: status}, 
                {
			        headers:
			        {
				    'token':localStorage.getItem('jwt_token')
			        }
		        })
                const newChannel : Channel = res.data;
                this.chat.ChannelList.push(newChannel);
                return res;
        	}
            catch (error: any)
            {
                // console.log("Error: addChannels: " + error);
                return (error);
            }
        },
      },
      
     persist: true,
  })