<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import FriendBis from './FriendBis.vue';
const userStore = useUserStore();

const friends = userStore.getFriends
</script>

<template>
    <h2 style="text-align: center; " class="m-5"> {{ userStore.getUserName }}'s Friends </h2>
    <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 42rem; max-height: 65rem;">
        <template v-for="(friend, index) in friends" :key="index">
            <FriendBis :login42="friend"></FriendBis>
        </template>
    </div>
</template>