<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { type UserInfo } from '../../types';
import axios from 'axios';
import ProfileCard from '@/components/ProfileDisplay/ProfileCard.vue';

const store = useUserStore();

let userdata: UserInfo;

async function getProfileData() {
  try {
    const res = await axios.get(`http://localhost:3000/user/one:lars`);
    console.log(res.data);
    userdata = res.data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
  }
};

function addFriend() {
  console.log("Add as friend clicked for:", store.getUserName);
}

function startMatch() {
  console.log("Start match clicked for:", store.getUserName);
}

function blockUser() {
  console.log("Block clicked for:", store.getUserName);
}

await getProfileData();

watch(() => userdata.username, getProfileData);

</script>

<template>
  <div v-if="userdata">
      <ProfileCard :user="userdata"> </ProfileCard>
    <!-- Buttons -->
    <div class="button-container">
      <button @click="addFriend" class="user-button">Add as Friend</button>
      <button @click="startMatch" class="user-button">Start Match</button>
      <button @click="blockUser" class="user-button">Block</button>
    </div>
  </div>
</template>

<style scoped>

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;  /* Adjust the width to match the image and text */
  align-self: center;  /* Center the button container */
}

.user-button {
  width: 20%;
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