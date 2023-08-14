<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import Friend from './Friend.vue';
const userStore = useUserStore();

const friends = userStore.getFriends
const friend: any = friends[0]
</script>

<template>
<h2> Socials </h2>
<div class="border border-dark border-2 m-3">
    <div v-for="(friend, index) in friends" :key="index">
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
.friendsDisplay {
    font-size: small;
    text-align: center;
}
</style>