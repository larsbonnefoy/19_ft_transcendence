<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  username: String,
  login: String,
});

const emit = defineEmits(["open-profile"]);

let dataLoaded = ref(false);
let userdata= ref<{ photo?: string, username?: string }>({});

async function getProfileData(login: string) {
  try {
    const res = await axios.get(`http://localhost:3000/user/findone:${login}`, {
      headers: {
        'token': localStorage.getItem('jwt_token')
      }
    });
    userdata.value = res.data;
    // console.log("data :", userdata.value);
    // console.log("photo :", userdata.value.photo);

    if (userdata.value.photo === "no photo yet") {
      userdata.value.photo = "../../../assets/placeholder_avatar.png";
    }

    dataLoaded.value = true;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
  }
}

function openProfile() {
  emit('open-profile', props.login);
  getProfileData(props.login);
}

// Fetch user data immediately upon component load
onMounted(() => {
  getProfileData(props.login);
});


</script>

<template>  
  <!-- If the user is not 'You', allow clicking on the profile -->
  <button v-if="username !== 'You'" @click="openProfile" class="profile-button">
    <img :src="userdata.photo" alt="User Profile Picture" class="profile-picture">
    {{ username }}
  </button>
  
  <!-- If the user is 'You', display the username without the click event and the photo-->
  <button v-else class="profile-button">
    {{ username }}
  </button>

</template>
  
<style scoped>
.profile-button {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.profile-button:hover {
  background-color: transparent;
  border: none;
  color: white;
  text-decoration: underline;
  cursor: pointer;
}

.profile-picture {
  width: 40px;        
  height: 40px;
  border-radius: 50%; 
  margin-right: 10px; 
  object-fit: cover;  
}

</style>

