<script setup lang="ts">
import { useChannelStore, useChatStore } from '@/stores/chat';
import { ref, onUnmounted } from 'vue';
import { type UserInfo } from '../../types';
import axios, { type AxiosResponse } from 'axios';
import UserButton from './UserButton.vue';

const channelStore = useChannelStore();
// Example list of users in the channel
// const currentUsers = ref<UserInfo[]>([]);

const channelName = ref('');  
const password = ref('');  
const errorMessage = ref('');
const userInput = ref('');
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

const addUser = async () => {
  if (userInput.value.trim().length === 0)
    return;
  // console.log('adduser');
  errorMessage.value = '';
   {
    try 
    {
      const log: any = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/LogFromUser:${userInput.value}`);
      // console.log(log.data.login42);
      if(log?.data.login42 === me)
      {
        errorMessage.value = `You cannot add yourself`;
        return ;
      }
      else
      {
        await channelStore.addChatter(userInput.value);
        errorMessage.value = `added : ${userInput.value}`
        return;
      }
    }
    catch (error: any)
    {
      console.log('error')
      console.log(error.request.response);
      if (error?.request.response)
      {
        const err: any = JSON.parse(error?.request.response)
        errorMessage.value = err.error;
      }
      else
        errorMessage.value = "Unknown user";
      // userInput.value = '';
      return;
    }
    userInput.value = '';
  }
};
const emit = defineEmits(["close"]);
const closeModal = () => emit('close');

const changePassword = async () => {
    if (password.value.trim().length === 0) 
      return;
    // console.log('Password changed to:', password.value);
    const res: boolean = await channelStore.changePassword(password.value) 
    // console.log("bool: "+ res);
    if (!res)
    {
      errorMessage.value = 'forbidden';
      return;
    }
    errorMessage.value = `Password Changed ` 
    password.value = '';
};

const changename = async () => {
    if (channelName.value.trim().length === 0) 
      return;
    // console.log('Name changed to:', password.value);
    const res = await channelStore.changeName(channelName.value) 
    // console.log("bool: "+ res);
    if (!res)
    {
      errorMessage.value = 'forbidden';
      return;
    }
    errorMessage.value = `Name changed to ` + channelName.value
    channelName.value = '';
  }

const deletePassword = async () => {
    password.value = '';
    const res: boolean = await channelStore.deletePassword()
    console.log("bool: "+ res);
    if (!res)
    {
      errorMessage.value = 'forbidden';
      return;
    }
    errorMessage.value = 'Password deleted.';
};

const leaveChannel = async () => {
    // console.log('Left the channel.');
    emit('close');
    await channelStore?.leave(me);
};
const section = ref('Manage Channel');  // The current section being displayed.
if (channelStore.getIsDm)
  section.value = 'Current Users';  // The current section being displayed.
const toggleSection = () => {
    section.value = section.value === 'Current Users' ? 'Manage Channel' : 'Current Users';
};



// Context menu control
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: '0', y: '0' });
const selectedUser = ref('');
const selectedUserStatus = ref('');


// Close the context menu when clicked outside
const closeContextMenu = () => {
    contextMenuVisible.value = false;
};
document.addEventListener('click', closeContextMenu);

// Cleanup the listener
onUnmounted(() => {
    document.removeEventListener('click', closeContextMenu);
});
</script>

<template>

  <template v-if="!channelStore.getIsDm">
     <div class="modal-background">
         <div class="modal-content">
          <button @click="closeModal" class="close-button">X</button>
           <template v-if="!channelStore.getChatters?.find((it: UserInfo) => {return it.login42 === me})">
             <h2>Edit Channel</h2>
               <button @click="toggleSection" class="switch-create-button">
                 {{ section === 'Current Users' ? 'Switch to Manage Channel' : 'Switch to Current Users' }}
               </button>
              
             <!-- Display the section based on the toggle -->
             <div v-if="section === 'Current Users'">
             <!-- Section for Current Users -->
             <div>
               <h4>Owner</h4>
                 <div class="user-scroll-container">
                   <UserButton :user="channelStore?.getOwner" status="owner"/>
                 </div>
               <h4>Admins</h4>
                 <div class="user-scroll-container">
                   <UserButton v-for="user in channelStore.getAdmins" :key="user.username" :user="user" status="admin"/>
                 </div>
               <h4>Members</h4>
                 <div class="user-scroll-container">
                   <UserButton v-for="user in channelStore.getChatters" :key="user.username" :user="user" status="chatter"/>
                 </div>
             </div>
            
         </div>
        
             <div v-else>
                 <!-- Channel Name -->
                 <div class="input-container">
                     <input maxlength="24" v-model="channelName" placeholder="Change channel name..." @keydown.enter="changename"/>
                 </div>
                
                 <!-- Add New Users -->
                 <h3>Add Users</h3>
                 <div class="input-container">
                     <input v-model="userInput" placeholder="Add a user..." @keydown.enter="addUser"/>
                     <button @click="addUser" class="add-button">Add</button>
                 </div>
                     <div v-if="errorMessage" style="font-size: small">{{ errorMessage }}</div> <!-- Error message display for group chat -->
                
                 <!-- Password Management -->
                 <h3>Password Management</h3>
                 <div class="input-container">
                     <input v-model="password" placeholder="Change password..." @keydown.enter="changePassword"/>
                 </div>
                 <button @click="deletePassword">Delete Password</button>
                
                 <!-- Leave Channel -->
             </div>
          </template>
           <button @click="leaveChannel">Leave</button>
         </div>
     </div>
  </template>
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
  /* position: absolute; */
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
  background-color: #555550;
  color: #ffffff;
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

.user-scroll-container {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
    /* border: 1px solid #ffffff; */
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    font-size: medium;
    list-style-type: none;
    border-radius: 20px;
    /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); */
}

.user-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
    list-style: none;

}
</style>
