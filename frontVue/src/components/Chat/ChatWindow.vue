<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import MessageBox from './MessageBox.vue';
import axios from 'axios';
import { useChannelStore } from '@/stores/chat';
import { socket } from '@/socket';
import EditChannel from './EditChannel.vue';

const channel = useChannelStore();
const showEditChannel = ref(false);
const props = defineProps({
  // messages: Array,
  user: Object,
  selectedChannel: String,
});

  // props: ['selectedChannel'];

const newMessage = ref("");
let me : string
try
{
   me = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
    headers:
        {
          'token':localStorage.getItem('jwt_token')
        }
  })).data;
}
catch (error)
{
  me = '';
}
function getDmChatter()
{
  if(channel?.getChatters)
  {
    if (channel.getChatters[0]?.login42 === me)
      return channel.getOwner?.username;
    return (channel.getChatters[0]?.username);
  }
}


// Methods

// const channel = ChannelButton.channel.name
// if (channel)
//        console.log("yo: " + channel);
//        console.log("yo: " + ChannelButton.channel.test);
const emit = defineEmits(["open-profile"]);



const sendMessage = async () => {

  if (newMessage.value && newMessage.value.trim().length !== 0)
  {
    const retval: boolean = await channel.addMessage(newMessage.value);
    if (retval)
      socket.emit("send",{target: channel.getId, message: newMessage.value, token: localStorage.getItem('jwt_token')});
  }
    newMessage.value = "";
};





function handleOpenProfile(user: string) {
  // console.log("chatWindow : "+ user)
  emit('open-profile', user);
}

onMounted(async () => {
  socket.on("getMessage", (data : any) => {
    // console.log("response: "+ data.login + " " + data.message);
    channel.refreshMessages();
  });
})

onUnmounted(async () => {
  socket.emit("leaveChannel",{target: channel.getId, token: localStorage.getItem('jwt_token')});
  socket.off("getMessage");
  channel.unsetChannel();
});

// console.log(channel.getId)
</script>

<template>
  <div class="chat-window">
    <!-- Chat header -->
    <div class="chat-header">
      <template v-if="channel.getId">
        <template v-if="!channel?.getIsDm">
          <span class="channel-name">{{ channel?.getName }}</span>
        </template>
        <template v-else>
          <span class="channel-name">{{ getDmChatter() }}</span>
        </template>
      </template>
      <template v-if="channel.getId">
        <template v-if="!channel.getIsDm">
          <!-- <template v-if="!channel.getChatters?.find((it: UserInfo) => {return it.login42 === me})"> -->
            <button @click="showEditChannel = !showEditChannel" class="gear-icon">⚙️</button>
            <EditChannel v-if="showEditChannel" @close="showEditChannel = false"/>
          <!-- </template> -->
        </template>
      </template>
    </div>

    <!-- <div id="ChatWindow">{{selectedChannel}}</div> -->
    <MessageBox 
      :user="user"
      class="chat-messages" 
      @open-profile="handleOpenProfile"
    />
    <div class="chat-input-container">
      <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="type a message"/>
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
    <div id="endOfChat" ref="endOfChatRef"></div>
  </div>
  <div class=channelHandler>

  </div>
</template>

<style scoped>
.chat-window {
    height: 94vh;
    padding-right: 2px; /* Reduced padding */
    border-right: 1px solid #a8abae; 
    border-left: 1px solid #a8abae;
    display: flex;
    flex-direction: column;
}

.chat-messages {
  padding: 0.5rem 0; /* Adjusted padding */
    margin-bottom: 0.5rem;
}

/* Chat Input Container */
.chat-input-container {
    padding: 0.7rem;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center; /* Vertically center the items */
    border-radius: 50px; /* Circular edges */
    background-color: #8e8e8e;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    position: relative; /* To position the send button absolutely */
}

/* Chat Input (Text field) */
.chat-input-container input {
    flex: 1;
    padding: 0.5rem; /* Increased padding for comfort */
    padding-right: 3rem; /* Space for the "Send" button */
    font-size: 1rem;
    border: none; /* Remove border */
    border-radius: 40px; /* Circular edges */
    outline: none; /* Remove default focus outline */
    background-color: transparent; /* Transparent background to blend with the container */
    transition: box-shadow 0.3s, background-color 0.3s; /* Smooth transitions */
    height: 100%; /* Take full height of the container */
    border-top-right-radius: 0; /* Make the top right edge square */
    border-bottom-right-radius: 0; /* Make the bottom right edge square */
    color: #ffffff;
}

.chat-input-container input::placeholder {
    color: #d4d4d4; 
}

/* Send Button */
.chat-input-container .send-button {
    position: absolute;
    right: 0; 
    background-color: #555550; 
    color: #ffffff; 
    border: none;
    padding: 0.5rem 1rem; 
    border-top-left-radius: 0; 
    border-bottom-left-radius: 0; 
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px; 
    border-top-right-radius: 25px; 
    border-bottom-right-radius: 25px; 
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s; 
    outline: none; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    height: 100%; 
}

.chat-input-container .send-button:hover {
    background-color: #494949;
} 

.chat-input-container .send-button:active {
    transform: scale(0.94); 
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6c757d; /* You can choose your own color */
  padding: 10px 15px;
  color: white;
  font-size: 40px;
}

.channel-name {
  flex: 1;
  text-align: center;
  color: #ffffff;
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)); 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  border: none;
  padding: 0.5rem 1rem; 
  border-top-left-radius: 0; 
  border-bottom-left-radius: 0; 
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px; 
  border-top-right-radius: 25px; 
  border-bottom-right-radius: 25px; 
  max-width: 33%;
  font-size: large;
}

.gear-icon {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
}

</style>
  
