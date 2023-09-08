<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props
const { user } = defineProps({
    user: Object
});

const emit = defineEmits(["show-context-menu"]);

function emitContextMenu(event) {
    emit('show-context-menu', event);
}

function banUser() {
    console.log(`Banned user: ${user.username}`);
}

function removeUser() {
    console.log(`Removed user: ${user.username}`);
}

function kickUser() {
    console.log(`Kicked user: ${user.username}`);
}

function promoteUser() {
    console.log(`Promoted user: ${user.username}`);
}
</script>

<template>
    <div class="user-container">
      <span class="username">{{ user.username }}</span>
      <button @click="banUser" class="action-button ban-button">Ban</button>
      <button @click="kickUser" class="action-button kick-button">Kick</button>
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
  
  .action-button:hover {
    background-color: #333;
  }
  </style>