<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
// import router from '@/router';
import {useRouter} from 'vue-router'
const router = useRouter();


const store =  useUserStore();

onMounted(async () => {
 await store.fetchUser();
  if(store.getUser == null)
		router.push('/');
});

</script>

<template>
    <h1> Welcome {{ store.getUserName}}</h1>
</template>

<style>
</style>
