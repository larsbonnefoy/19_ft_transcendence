<script setup lang="ts">
import {ref} from 'vue'
import { useUserStore } from '@/stores/user';
import FriendBis from './FriendBis.vue';
const userStore = useUserStore();

const hasFriends = ref(false);

const friends = userStore.getFriends
if (friends != undefined && friends.length != 0) {
    hasFriends.value = true;
}
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Friends </h2>
    <div v-if="hasFriends"> 
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
            <template v-for="(friend, index) in friends" :key="index">
                <FriendBis :login42="friend"></FriendBis>
            </template>
        </div>
    </div>
    <div v-else> 
        <h3 style="text-align: center;"> No Friends </h3>
    </div>
</template>