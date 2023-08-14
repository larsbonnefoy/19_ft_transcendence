<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import Friend from './Friend.vue';
const userStore = useUserStore();

const friends = userStore.getFriends
</script>

<template>
<h2> Socials </h2>
<div class="m-3">
    <div v-for="(friend, index) in friends" :key="index" class="m-1">
        <Friend :login42="friend">
        </Friend>
    </div>
</div>
</template>

<style scoped>
h2 {
    text-align: center;
    margin: 10%;
}

</style>