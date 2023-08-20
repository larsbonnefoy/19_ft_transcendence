<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import type { UserInfo } from '../../types';
import axios from 'axios';

const store = useUserStore();

const userData = ref<UserInfo | null>(null);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/user/one:${"lyaiche"}`);
    userData.value = res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

function addFriend() {
  console.log("Add as friend clicked for:", userData.value?.username);
}

function startMatch() {
  console.log("Start match clicked for:", userData.value?.username);
}

function blockUser() {
  console.log("Block clicked for:", userData.value?.username);
}
</script>

<template>
  <div class="user-profile" v-if="userData">
    <h3>User Profile</h3>
    <!-- User Image -->
    <img :src="userData.photo" alt="User Image" class="user-image" />
    <!-- User Name -->
    <h4 class="user-name">{{ userData.username }}</h4>
    <!-- User Login (Tag) -->
    <span class="user-login">{{ userData.login42 }}</span>
    <!-- Buttons -->
    <div class="button-container">
      <button @click="addFriend" class="user-button">Add as Friend</button>
      <button @click="startMatch" class="user-button">Start Match</button>
      <button @click="blockUser" class="user-button">Block</button>
    </div>
  </div>
</template>

<style>
.user-profile {
  width: 33%;
  padding: 20px;
  border-left: 1px solid #dee2e6;
  background-color: #6c757d;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 94.3vh;  
}

.user-image {
  width: 500px;
  height: 400px;
  border-radius: 10%;
  object-fit: cover;
  margin-bottom: 15px;
}

h4 {
  margin: 10px 0;
}
.user-name {
  font-size: 2.2em;
  margin-bottom: 5px;
  color: #ffffff; /* White color for the username */
}

.user-login {
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #ffffff; /* White color for the user tag (subtitle) */
}


.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.user-button {
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007BFF;
  color: white;
}

.user-button:hover {
  background-color: #0056b3;
}
</style>