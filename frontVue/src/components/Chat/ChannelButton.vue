<script setup lang="ts">
import { useChatStore, useChannelStore} from '@/stores/chat';
import { type Channel } from '@/types';
import {types} from "sass";
import Boolean = types.Boolean;
import axios from "axios";
import { socket } from '@/socket';

const chat = useChatStore();
const channelStore = useChannelStore();


const me = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }
})).data;

// Props
 const { channel } = defineProps({
  channel: Object,
});


function getDmChatter()
{
  if(channel?.chatters[0])
  {
    console.log("getDm: " + channel.chatters[0]?.username + " " + me + " "  +  channel.owner?.login42)
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
    console.log(`Selected: ${channel.id}`);
    const newChannel: Channel | undefined = chat.getChannels?.find((it: Channel) => {return (it.id === channel?.id)})
    if (newChannel)
    {
      console.log(newChannel.id);
     if (channel?.id)
        socket.emit("leaveChannel",{target: channelStore.getId, token: localStorage.getItem('jwt_token')});
      await channelStore.setChannel(newChannel);
      socket.emit("joinChannel",{target: newChannel.id, token: localStorage.getItem('jwt_token')});
    }
    // console.log(channelStore.getMessages);
    console.log("done");
  }
  // emit('channel-selected',  channel.id);
};
</script>

<template>
    <button class="channel-button" @click="selectChannel">
      {{ channelName }}
    </button>
</template>


<style scoped>

.channel-button {
  padding: 15px 25px 15px 20px; /* Increase the right padding to create a bigger gap */
  border: none;
  background-color: #7289da;
  color: white;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.3s ease;
  display: block;
  width: 99.5%;
  margin-bottom: 2px; /* Increase the margin-bottom to create a bigger gap between buttons */
}
.channel-button:hover {
  background-color: #5b6eae;
}
</style>
