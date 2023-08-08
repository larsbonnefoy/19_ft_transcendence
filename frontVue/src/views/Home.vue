<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

onMounted(() => {
  store.fetchUser();
});

</script>

<template>
    <h1> Welcome {{ store.$state.user?.username }}</h1>
</template>

<style>
</style>
