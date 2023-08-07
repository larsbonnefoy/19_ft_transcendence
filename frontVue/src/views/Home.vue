<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

onMounted(() => {
  store.fetchUsers();
});

const name = store
</script>

<template>
    <h1> Welcome {{ store.$state.user?.loggin42 }}</h1>
    <p> elo {{ store.$state.user?.elo }}</p>
    <p> status {{ store.$state.user?.status }}</p>
</template>

<style>
</style>
