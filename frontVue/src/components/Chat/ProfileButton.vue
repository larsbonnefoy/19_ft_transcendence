<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { type UserInfo } from '@/types';

const props = defineProps({
  username: String,
  login: String,
});



const emit = defineEmits(["open-profile"]);
async function openProfile() {
  emit('open-profile', props.login);
}


</script>

<template>  
  <!-- If the user is not 'You', allow clicking on the profile -->
  <button v-if="username !== 'You'" @click="openProfile" class="profile-button">
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



</style>

