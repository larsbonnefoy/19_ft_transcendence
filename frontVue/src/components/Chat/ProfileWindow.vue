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

let userdata: UserInfo;

let dataLoaded = ref(false)


async function getProfileData(user: string) {
  try {
    console.log('Current selected user:a', user);

    const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/findone:${user}`, {
      headers:
          {
            'token':localStorage.getItem('jwt_token')
          }});
    userdata = res.data;
    userdata.photo = await store.getAvatar(userdata.photo);
    console.log(userdata.photo);
    dataLoaded.value = true;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
  }
};


//  Dont need those, already on profile card
// function addFriend() {
//   console.log("Add as friend clicked for:", store.getUserName);
// }

// function startMatch() {
//   console.log("Start match clicked for:", store.getUserName);
// }

// function blockUser() {
//   console.log("Block clicked for:", store.getUserName);
// }


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
  padding: 0;  /* Remove padding */
  margin: 0;  /* Remove margin */
}


.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;  /* Adjust the width to match the image and text */
  align-self: center;  /* Center the button container */
  display: flex;            
  justify-content: center;  
  align-items: center;      

}

.start-match-button {
  width: 10vw;
  height: 5vh;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #555550;
  color: white;
  display: flex;            
  justify-content: center;  
  align-items: center;      
}

.start-match-button:hover {
  background-color: #494949;
}

</style>