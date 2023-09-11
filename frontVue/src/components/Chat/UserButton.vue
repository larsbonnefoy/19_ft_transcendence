<script setup lang="ts">
import { useChannelStore } from '@/stores/chat';

const channelStore = useChannelStore();
// Props
const { user, status } = defineProps({
    user: Object,
	status: String
});

const removeUser = async () => {
    await channelStore.removeUser(user?.login42, status);
};

const promoteUser = async () => {
    if (status === 'chatter')
    await channelStore.promoteChatter(user?.login42)
};
const banUser = async () => {
    await channelStore.addBan(user?.login42, status);
};
const kickUser = async () => {
    // Add logic to promote the selected user to admin
    // console.log(`Kick user: ${user?.login42}`);
    await channelStore.kickUser(user?.login42, status);
};

const muteUser = async () => {
    // Add logic to promote the selected user to admin
    // console.log(`Mute user: ${user?.login42}`);
    await channelStore.muteUser(user?.login42);
};

</script>

<template>
    <div class="user-container">
      <span class="username">{{ user?.username }}</span>
      <button @click="banUser" class="action-button ban-button">Ban</button>
      <button @click="kickUser" class="action-button kick-button">Kick</button>
      <button @click="muteUser" class="action-button mute-button">Mute</button>
      <button @click="removeUser" class="action-button remove-button">Remove</button>
      <button @click="promoteUser" class="action-button promote-button">Promote</button>
    </div>
  </template>
  
  <style scoped>
  .user-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background-color: #555550;
    color: white;
    border-radius: 15px;
    transition: background-color 0.3s ease;
    margin-bottom: 2px;
  }
  
  .user-container:hover {
    background-color: #494949;
  }
  
  .username {
    flex: 1;
    text-align: left;
  }
  
  .action-button {
    background: none;
    border: 1px solid #888; /* general border for all buttons */
    color: white;
    cursor: pointer;
    margin-left: 5px;
    padding: 2px 5px; /* added padding for better appearance */
    border-radius: 5px; /* rounded corners */
    transition: color 0.3s, background-color 0.3s; /* transition for hover effects */
  }
  
  .ban-button {
    border-color: #c0392b; /* red */
  }
  
  .remove-button {
      border-color: #f39c12; /* yellow */
    }
    
    .kick-button {
        border-color: #d35400; /* orange */
    }
    
  .promote-button {
    border-color: #27ae60; /* green */
  }
    .mute-button {
      border-color: #f38a12; /* yes */
  }
  .action-button:hover {
    background-color: #333;
  }
  </style>