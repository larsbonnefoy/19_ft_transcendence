<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const friends = userStore.getFriends

</script>

<template>
<h2> Socials </h2>
<div v-for="(friend, index) in friends" class="list-group" :key="index">
    <a href="#" class="list-group-item list-group-item-action list-group-item-dark friendsDisplay">{{ friend }} - <span style="font-style: italic;"> online </span></a>
    <!-- 
    <img src="../../assets/presence_available.png" />
    -->
</div>
</template>

<style scoped>
h2 {
    text-align: center;
    margin: 10%;
}
.friendsDisplay {
    font-size: small;
}
</style>