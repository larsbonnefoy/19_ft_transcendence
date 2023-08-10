<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

</script>

<template>
    <h1> Welcome {{ store.getUserName}}</h1>
</template>

<style>
</style>
