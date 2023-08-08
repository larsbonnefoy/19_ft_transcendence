<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

onMounted(() => {
  store.fetchUser();
});

const name = store
</script>

<template>
    <h1> Welcome {{ store.$state.user?.loggin42 }}</h1>
    
</template>

<style>
</style>
