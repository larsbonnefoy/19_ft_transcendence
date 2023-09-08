<script setup lang="ts">
import axios, { type AxiosResponse } from 'axios';
import { ref } from 'vue';
import { socket } from '@/socket';

import { useChatStore, useChannelStore } from '@/stores/chat';

const chat = useChatStore();
const channelStore = useChannelStore();

const password = ref('');
const errorMessage = ref('');
const { hasPass, id } = defineProps({
  hasPass: Boolean,
  id: Number
}) 


const emit = defineEmits(["close"]);

async function selectChannel()
{
  if (chat && channelStore)
  {
    {
     console.log(`Selected: ${id}`);
     const newChannel: Channel | undefined = chat.getChannels?.find((it: Channel) => {return (it.id === id)})
     if (newChannel)
     {
        console.log(newChannel.id);
        socket.emit("leaveChannel",{target: channelStore.getId, token: localStorage.getItem('jwt_token')});
        await channelStore.setChannel(newChannel);
        socket.emit("joinChannel",{target: newChannel.id, token: localStorage.getItem('jwt_token')});
     }
     // console.log(channelStore.getMessages);
     console.log("done");
    }
  }
}

const submit = async () => {
  try
	{
    // const res: any = await chat.(name, pass, isDm, isPrivate.value, addedUsers.value); JOIN CALL
    await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/joinChannel`, {id: id, password: password.value},
    {
        headers: 
        {
	        'token':localStorage.getItem('jwt_token')
	    }
    });
    await chat.fetchChannels();
    await selectChannel();
  }
	catch (error: any)
	{
    console.log("error")
    errorMessage.value = "Bad Password"
    return;
	}
  emit('close');
};

const closeModal = () => {
  emit('close');
};

</script>

<template>
  <div class="modal-background">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">X</button>
      <h2>Join New Channel</h2>
        <template v-if="hasPass">
         <div class="input-container">
            <input v-model="password" type="password" placeholder="password" @keydown.enter="submit" />
         </div>
        </template>
        <div v-if="errorMessage">{{ errorMessage }}</div> <!-- Error message display for group chat -->
       <button @click="submit" class="switch-create-button">Join Channel</button>
      </div>
      </div>
</template>

<style scoped>
/* Modal Background */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
.modal-content {
  background-color: #6c757d;
  color: #ffffff;
  padding: 30px;
  border-radius: 20px;
  width: 80%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.option-label {
    margin-right: 20px; /* Adjust as per your preference */
}
.user-display {
  position: relative;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-display:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-list {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #6c757d;
  border: 1px solid #ffffff;
  border-radius: 10px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
}

.user-display:hover .user-list {
  display: block;
}
button.switch-create-button {
  background-color: #505050;
  color: #ffffff;
  transition: background-color 0.3s, transform 0.1s;
}

button.switch-create-button:hover {
  background-color: #3d3d3d;
}

button.switch-create-button:active {
  transform: scale(0.95);
}

.close-button, button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  color: rgb(188, 0, 0);
  padding: 10px 20px;
  border-radius: 15px;
  margin: 10px 0;
}

button {
  background-color: #ffffff;
  color: #6c757d;
  height: 3vh;
  width: 50wh;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
}

.close-button:hover {
  color: red;
}

/* Input Container */
.input-container {
  padding: 0.5rem;
  display: flex;
  align-items: center; /* Vertically center the items */
  border-radius: 25px; /* Circular edges */
  background-color: #8e8e8e;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  position: relative; /* To position the add button absolutely */
  margin: 10px 0; /* Margin for spacing */
}

/* Search Input (Text field) and Password Input */
.input-container input {
  flex: 1;
  padding: 0.5rem; /* Increased padding for comfort */
  padding-right: 3rem; /* Space for the "Add" button */
  font-size: 1rem;
  border: none; /* Remove border */
  border-radius: 25px; /* Circular edges */
  outline: none; /* Remove default focus outline */
  background-color: transparent; /* Transparent background to blend with the container */
  color: #ffffff;
}

.input-container input::placeholder {
  color: #d4d4d4;
}

/* Add Button */
.input-container .add-button {
  position: absolute;
  right: 0; 
  background-color: #555550; 
  color: #ffffff; 
  border: none;
  padding: 0.5rem 1rem; 
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px; 
  border-top-right-radius: 25px; 
  border-bottom-right-radius: 25px; 
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s; 
  outline: none; 
  height: 100%;
  width: 3vw;
}

.input-container .add-button:hover {
  background-color: #494949;
} 

.input-container .add-button:active {
  transform: scale(0.97); 
}
</style>
