<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

// Example list of users in the channel
const currentUsers = ref(['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15']);

const channelName = ref('');  
const password = ref('');  

const addUser = () => {
    console.log('User added.');
};

const changePassword = () => {
    console.log('Password changed to:', password.value);
};

const deletePassword = () => {
    password.value = '';
    console.log('Password deleted.');
};

const leaveChannel = () => {
    console.log('Left the channel.');
};

const section = ref('Manage Channel');  // The current section being displayed.
const toggleSection = () => {
    section.value = section.value === 'Current Users' ? 'Manage Channel' : 'Current Users';
};

const emit = defineEmits(["close"]);
const closeModal = () => emit('close');

// Context menu control
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: '0px', y: '0px' });
const selectedUser = ref(null);

const showContextMenu = (event, user) => {
    contextMenuVisible.value = true;
    contextMenuPosition.value = { x: `${event.pageX}px`, y: `${event.pageY}px` };
    selectedUser.value = user;
};

const removeUser = () => {
    // Add logic to remove the selected user
    console.log(`Remove user: ${selectedUser.value}`);
    contextMenuVisible.value = false;
};

const promoteUser = () => {
    // Add logic to promote the selected user to admin
    console.log(`Promote user to admin: ${selectedUser.value}`);
    contextMenuVisible.value = false;
};
const banUser = () => {
    // Add logic to promote the selected user to admin
    console.log(`Ban user: ${selectedUser.value}`);
    contextMenuVisible.value = false;
};
const kickUser = () => {
    // Add logic to promote the selected user to admin
    console.log(`Kick user: ${selectedUser.value}`);
    contextMenuVisible.value = false;
};

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
    <div class="modal-background">
        <div class="modal-content">
            <button @click="closeModal" class="close-button">X</button>
            <h2>Edit Channel</h2>
            <button @click="toggleSection" class="switch-create-button">
                {{ section === 'Current Users' ? 'Switch to Manage Channel' : 'Switch to Current Users' }}
            </button>
    
            <!-- Display the section based on the toggle -->
            <div v-if="section === 'Current Users'">
            <!-- Section for Current Users -->
            <h3>Current Users</h3>
            <div class="user-scroll-container">
                <!-- <ul class="user-list"> -->
                    <li v-for="user in currentUsers" :key="user" @contextmenu.prevent="showContextMenu($event, user)">
                        {{ user }}
                    </li>
                <!-- </ul> -->
            </div>
            <div v-if="contextMenuVisible" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" class="context-menu">
                <ul>
                    <li @click="removeUser">Remove</li>
                    <li @click="promoteUser">Promote to Admin</li>
                    <li @click="banUser">Ban</li>
                    <li @click="kickUser">Kick</li>
                    <!-- Add more options as needed -->
                </ul>
            </div>
        </div>
    
            <div v-else>
                <!-- Channel Name -->
                <div class="input-container">
                    <input v-model="channelName" placeholder="Change channel name..." />
                </div>
    
                <!-- Add New Users -->
                <h3>Add Users</h3>
                <div class="input-container">
                    <input placeholder="Add a user..." @keydown.enter="addUser"/>
                    <button @click="addUser" class="add-button">Add</button>
                </div>
    
                <!-- Password Management -->
                <h3>Password Management</h3>
                <div class="input-container">
                    <input v-model="password" placeholder="Change password..." />
                </div>
                <button @click="deletePassword">Delete Password</button>
    
                <!-- Leave Channel -->
                <button @click="leaveChannel">Leave</button>
            </div>
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
  color: #a8a8a8;
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
  background-color: #505050;
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
  color: #a8a8a8; /* Placeholder color */
}

/* Add Button */
.input-container .add-button {
  position: absolute;
  right: 0; 
  background-color: #007BFF; 
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
  background-color: #0056b3;
} 

.input-container .add-button:active {
  transform: scale(0.97); 
}

.user-scroll-container {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
    border: 1px solid #ffffff;
    border-radius: 10px;
    padding: 10px;
}

.user-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.context-menu {
    position: absolute;
    background-color: #6c757d;
    border: 1px solid #ffffff;
    border-radius: 10px;
    z-index: 10;
    width: 150px;  /* Adjust width as per your need */
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

.context-menu li:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
