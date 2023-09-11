<script setup lang="ts">
import axios, { type AxiosResponse } from 'axios';
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';

const chat = useChatStore();

const messageType = ref('Direct Messages');
const groupType = ref('public');
const userInput = ref('');
const addedUsers = ref(['']);
const password = ref('');
const channelName = ref('');
const errorMessage = ref('');
const isPrivate = ref(false);

const toggleMessageType = () => {
  addedUsers.value = [];
  messageType.value = messageType.value === 'Direct Messages' ? 'group' : 'Direct Messages';
};
let me: string = ""
try{
 me = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }

})).data;
}
catch{}
const emit = defineEmits(["close"]);

const addUser = async () => {
  errorMessage.value = '';
  if (messageType.value === 'Direct Messages') {
    addedUsers.value = [];
    try 
    {
      const log: any = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/LogFromUser:${userInput.value}`);
      if(log?.data.login42 === me)
      {
        errorMessage.value = `You cannot add yourself`;
        return ;
      }
      const check = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/chat/getDmWith`, {target: userInput.value},
                 {
                    headers: 
                    {
	                    'token':localStorage.getItem('jwt_token')
	                }
                });
      if (check.data)
      {
        errorMessage.value = "Room already exist";
        addedUsers.value = [];
        return;
      }
      addedUsers.value = [userInput.value];
    }
    catch (error)
    {
      errorMessage.value = "Unknown user";
      addedUsers.value = [];
      // userInput.value = '';
      return;
    }
    userInput.value = '';
  } else {
    if (!addedUsers.value.includes(userInput.value)) {
      try 
      {
        const log: any = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/LogFromUser:${userInput.value}`);
        if(log?.data.login42 === me)
        {
         errorMessage.value = `You cannot add yourself`;
         return ;
       }
      }
      catch
      {
        errorMessage.value = "Unknown user"
        // userInput.value = '';
        return;
      }
      addedUsers.value.push(userInput.value);
    }
    userInput.value = '';
  }
};

const clearUsers = () => {
    addedUsers.value = [];
};
function setPrivate() {
  isPrivate.value = !isPrivate.value
  // console.log(isPrivate.value)
}
const submit = async () => {
  if (messageType.value === 'Direct Messages' && !addedUsers.value[0]) {
    errorMessage.value = 'You must add a user.';
    return;
  } 
  

  let name: string;
  let pass: string | null;
  let isDm: boolean;

  if (messageType.value === 'Direct Messages') 
  {
    name = "";
    pass = null;
    isDm = true;

  } 
  else 
  {
    if (channelName.value.trim().length === 0) {
     errorMessage.value = 'You must name the channel.';
      channelName.value = "";
      return;
    } 
    name = channelName.value;
    pass = password.value;
    isDm = false;
  }
  try
	{
    const res: any = await chat.addChannel(name, pass, isDm, isPrivate.value, addedUsers.value);
    if (res.code)
    {
      errorMessage.value ="Name already taken";
      return;
    }
	}
	catch (error: any)
	{
		alert (error)
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
      <h2>Create New Channel</h2>
      <button @click="toggleMessageType" class="switch-create-button">
        {{ messageType === 'Direct Messages' ? 'Switch to Group' : 'Switch to Direct Messages' }}
      </button>
  
      <div v-if="messageType === 'Direct Messages'">
        <div class="input-container">
          <input v-model="userInput" placeholder="Search for user" @keydown.enter="addUser"/>
          <button @click="addUser" class="add-button">Add</button>
        </div>
        <button @click="clearUsers" class="switch-create-button">Clear</button>
        <!-- Display chosen user for private chat -->
        <div class="user-display" v-if="addedUsers.length > 0">
          {{ addedUsers[0] }}
        </div>
        <div v-if="errorMessage">{{ errorMessage }}</div> <!-- Error message display for private chat -->
      </div>
  
      <div v-else>

	    <div class="input-container">
          <input maxlength="24" v-model="channelName" placeholder="Channel name" />
        </div>
        <div class="input-container">
          <input v-model="userInput" placeholder="Search for users" @keydown.enter="addUser"/>
          <button @click="addUser" class="add-button">Add</button>
        </div>
        <button @click="clearUsers" class="switch-create-button">Clear</button>
        <!-- Display number of added users -->
        <div class="user-display" v-if="addedUsers.length > 0">
          {{ addedUsers.length }} user(s) added
          <ul class="user-list">
            <li v-for="user in addedUsers.slice(0,10)" :key="user">{{ user }}</li>
          </ul>
        </div>
        <div v-if="errorMessage">{{ errorMessage }}</div> <!-- Error message display for group chat -->
        <div class="input-container">
          <input v-model="password" type="password" placeholder="Set a password (optional)" />
        </div>
    <div class="row" style="margin: auto;"> 
        <div class="col-6 m-0">
         <input type="radio" class="btn-check" name="select-private" id="select-public" autocomplete="off" :checked="!isPrivate" @click="setPrivate()">
            <label class="btn btn-outline-success" for="select-public">Public</label>
        </div>
        <div class="col-6 m-0"> 
          <input type="radio" class="btn-check" name="select-private" id="select-private" autocomplete="off" :checked="isPrivate" @click="setPrivate()">
            <label class="btn btn-outline-danger" for="select-private">Private</label>
        </div>
      </div>
        <!-- <div v-if="isPrivate === true">
          <radio @click="setPrivate" class="switch-create-button">Set Public</radio>
        </div>
        <div v-else>
          <radio @click="setPrivate" class="switch-create-button">Set Private</radio>
        </div> -->
      </div>
  
      <button @click="submit" class="switch-create-button">Create Channel</button>
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
