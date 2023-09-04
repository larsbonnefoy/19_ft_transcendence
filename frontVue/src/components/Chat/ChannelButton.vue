<script setup lang="ts">
import { ref } from 'vue';
import EditChannel from './EditChannel.vue';  // Importing the EditChannel component
import { useChatStore, useChannelStore } from '@/stores/chat';
import { type Channel } from '@/types';
import {types} from "sass";
import axios from "axios";
import { socket } from '@/socket';

const chat = useChatStore();
const channelStore = useChannelStore();
const emit = defineEmits(['click']);


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
    if(!isPublic)
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
    else
    {
      console.log("PUBLIC " + channel?.id);
      const emitInfo: any = {id: channel?.id, hasPass: await channelStore?.hasPassFromId(channel?.id)}
      console.log(emitInfo.id);
      console.log(emitInfo.hasPass);
      console.log(emitInfo);
      emit('click', emitInfo)
    }
  }
}
// State for context menu and EditChannel modal
const showContextMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const showEditChannel = ref(false);  // State for showing the EditChannel modal

// Methods


const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  showContextMenu.value = true;
  menuPosition.value = { x: event.x, y: event.y };
};

const openEditChannel = () => {
  showContextMenu.value = false;  // Hide the context menu
  showEditChannel.value = true;   // Display the EditChannel modal
  console.log("modifying : ", channel.id);
};

document.addEventListener('click', () => {
  if (showContextMenu.value) {
    showContextMenu.value = false;
  }
});
</script>

<template>
  <div>
    <button class="channel-button" @click="selectChannel" @contextmenu="handleRightClick">
      {{ channelName }}

    </button>
    <div v-if="showContextMenu" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }" class="context-menu">
      <div @click="showEditChannel = !showEditChannel">Edit Channel</div>
    </div>
    <EditChannel v-if="showEditChannel" :channel="channel" @close="showEditChannel = false" />  
  </div>
</template>

<style scoped>
.channel-button {
  padding: 15px 25px 15px 20px;
  border: none;
  background-color: #7289da;
  color: white;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.3s ease;
  display: block;
  width: 99.5%;
  margin-bottom: 2px;
}
.channel-button:hover {
  background-color: #5b6eae;
}

.context-menu {
  position: absolute;
  z-index: 1000;
  background-color: #505050;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.context-menu div {
  padding: 10px;
  cursor: pointer;
}
.context-menu div:hover {
  border-radius: 5px;
  background-color: #414141;
}
</style>