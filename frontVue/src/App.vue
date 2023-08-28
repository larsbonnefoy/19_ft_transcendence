<script setup lang="ts">
import HeaderBar from './components/HeaderBar/HeaderBar.vue'
import { useUserStore } from './stores/user';
import { onUnmounted } from 'vue';
import axios from 'axios';
import { socket } from './socket';

window.addEventListener("beforeunload", leavingApp);
async function leavingApp() {
  /*
  axios.get(`http://localhost:3000/user/get`);
  try {
    axios.get(`http://localhost:3000/user/setStatus:offline`, { headers: {token: localStorage.getItem('jwt_token')} });
  }
  catch (error) {
    console.log(error);
  }
  */
  //set Status to offline
}
</script>

<template>
  <div class="bg-secondary vh-100 text-light">
    <HeaderBar class="h-10"></HeaderBar>
    <Suspense>
      <RouterView class="h-90"></RouterView>
    </Suspense>
  </div>
</template>

<style scoped>
/* .bgColor {
  background-color: #051323;
} */
</style>
