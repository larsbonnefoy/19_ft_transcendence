<script setup lang="ts">
import HeaderBar from './components/HeaderBar/HeaderBar.vue'
import { useUserStore } from './stores/user';

window.addEventListener("beforeunload", leavingApp);

const store = useUserStore();

async function leavingApp() {
  if (store.getUser != undefined) {
    store.setStatus("offline");
  }
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
.bgColor {
  background-color: #051323;
}
</style>
