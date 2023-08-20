<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted } from 'vue';
const store = useUserStore();

/* ATM ingame/online triggered when going to GAME menu */
onMounted(async () => {
    await store.setStatus("ingame");
})

onUnmounted(async () => {
    await store.setStatus("online");
})
</script>

<template>
    <h1> Game Page </h1>
</template>

<style>
</style>
