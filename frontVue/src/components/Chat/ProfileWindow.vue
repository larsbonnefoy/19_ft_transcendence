<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { type UserInfo } from '../../types';
import axios from 'axios';
import ProfileCard from '@/components/ProfileDisplay/ProfileCard.vue';

const store = useUserStore();
const props = defineProps({
  user: String
});
const selectedUser = ref(props.user);

let userdata= ref<UserInfo>();
let dataLoaded = ref(false)


async function getProfileData(user: string) {
  try {
<<<<<<< HEAD
    console.log('Current selected user:a', user);

    const res = await axios.get(`http://localhost:3000/user/findone:${user}`, {
=======
    const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me`, {
>>>>>>> main
      headers:
          {
            'token':localStorage.getItem('jwt_token')
          }});
    userdata.value = res.data;
    // console.log(userdata.value)
    dataLoaded.value = true;
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

// await getProfileData();

watch(() => props.user, async (newVal: any) => {
  dataLoaded.value = false;
  if (newVal) {
    await getProfileData(newVal);
  }
});

</script>

<template>
  <div class="profile-window" v-if="dataLoaded">
      <ProfileCard class="imitated-profile-card" :user="userdata"> </ProfileCard>
    <!-- Buttons -->
      <!-- <div class="button-container">
      <button @click="addFriend" class="user-button">Add as Friend</button>
      <button @click="startMatch" class="user-button">Start Match</button>
      <button @click="blockUser" class="user-button">Block</button>
    </div> -->
  </div>
</template>

<style scoped>
.profile-window {
  height: 94vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  /* width: 33%; */
  /* background-color: #6c757d; */
  padding: 0;  /* Remove padding */
  margin: 0;  /* Remove margin */
}


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