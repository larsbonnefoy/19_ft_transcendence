<script setup lang="ts">
import { useChatStore, useChannelStore} from '@/stores/chat';
import { type Channel } from '@/types';
import axios from "axios";
import { socket } from '@/socket';

const chat = useChatStore();
const channelStore = useChannelStore();
const emit = defineEmits(['click', 'channel-selected']);


const me = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }
})).data;

// Props
 const { channel, isPublic } = defineProps({
  channel: Object,
  isPublic: Boolean 
});


function getDmChatter()
{
  if(channel?.chatters)
  {
    if (channel.chatters[0]?.login42 === me)
      return channel.owner?.username;
    return (channel.chatters[0]?.username);
  }
}

let channelName = channel?.name;
if (channel?.isDm)
  channelName = getDmChatter();
// Methods
const selectChannel = async () => {
  if (channel && chat)
  {
    if(!isPublic)
    {
     const newChannel: Channel | undefined = chat.getChannels?.find((it: Channel) => {return (it.id === channel?.id)})
     if (newChannel)
     {
        if (channel?.id)
         socket.emit("leaveChannel",{target: channelStore.getId, token: localStorage.getItem('jwt_token')});
        await channelStore.setChannel(newChannel);
        socket.emit("joinChannel",{target: newChannel.id, token: localStorage.getItem('jwt_token')});
     }
    }
    else
    {
      const emitInfo: any = {id: channel?.id, hasPass: await channelStore?.hasPassFromId(channel?.id)}
      console.log(emitInfo.id);
      console.log(emitInfo.hasPass);
      console.log(emitInfo);
      emit('click', emitInfo)
    }
  }
}
</script>


<template>

  <button class="channel-button" @click="selectChannel">
    {{ channelName }}
  </button>
</template>

<style scoped>

.channel-button {
  padding: 15px 25px 15px 20px; 
  border: none;
  background-color: #555550;
  color: white;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.3s ease;
  display: block;
  width: 99.5%;
  margin-bottom: 2px; 
}
.channel-button:hover {
  background-color: #494949;
}
</style>
