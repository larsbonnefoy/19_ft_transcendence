<script setup lang="ts">
import {ref, computed} from 'vue'
import { useUserStore } from '@/stores/user';
import Friend from './Friend.vue';
import Pending from './Pending.vue';
import Blocked from './Blocked.vue'
const userStore = useUserStore();

const hasFriends = computed(() => {
  return (userStore.getFriends?.length != 0)
})

const pendingLen = computed(() => {
  return (userStore.getPending?.length)
})

const hasBlocked = computed(() => {
  return (userStore.getBlocked?.length != 0)
})

</script>

<template>

    <h2 style="text-align: center; " class="m-5">Socials</h2>
    <div v-if="hasFriends"> 
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
            <div class="card-body">
            <h5 class="card-title">Friends</h5> 
                <template v-for="(friend, index) in userStore.getFriends" :key="index">
                    <Friend :login42="friend"></Friend>
                </template>
            </div>
        </div>
    </div>
    <div v-else> 
        <h3 style="text-align: center;"> No Friends </h3>
    </div>

    <div v-if="pendingLen" :key="pendingLen">
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 30vh;">
            <div class="card-body">
            <h5 class="card-title">Pending</h5> 
                <template v-for="(pendingUser, index) in userStore.getPending" :key="index">
                    <Pending :login42="pendingUser"></Pending>
                </template>
            </div>
        </div>
    </div>

    <div v-if="hasBlocked">
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 30vh;">
            <div class="card-body">
            <h5 class="card-title">Blocked</h5> 
                <template v-for="(blockedUser, index) in userStore.getBlocked" :key="index">
                    <Blocked :login42="blockedUser"></Blocked>
                </template>
            </div>
        </div>
    </div>
</template>