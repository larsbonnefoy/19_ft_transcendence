<script setup lang="ts">
import {ref} from 'vue'
import { useUserStore } from '@/stores/user';
import Friend from './Friend.vue';
import Pending from './Pending.vue';
import Blocked from './Blocked.vue'
const userStore = useUserStore();

const hasFriends = ref(false);
const hasPending = ref(false);
const hasBlocked = ref(false);

const friends = userStore.getFriends
if (friends != undefined && friends.length != 0) {
    hasFriends.value = true;
}

const pendings = userStore.getPending
if (pendings != undefined && pendings.length != 0) {
    hasPending.value = true;
}

const blocked = userStore.getBlocked
if (blocked != undefined && blocked.length != 0) {
    hasBlocked.value = true;
}
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Socials</h2>
    <div v-if="hasFriends"> 
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
            <div class="card-body">
            <h5 class="card-title">Friends</h5> 
                <template v-for="(friend, index) in friends" :key="index">
                    <Friend :login42="friend"></Friend>
                </template>
            </div>
        </div>
    </div>
    <div v-else> 
        <h3 style="text-align: center;"> No Friends </h3>
    </div>

    <div v-if="hasPending">
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 10vh;">
            <div class="card-body">
            <h5 class="card-title">Pending</h5> 
                <template v-for="(pendingUser, index) in pendings" :key="index">
                    <Pending :login42="pendingUser"></Pending>
                </template>
            </div>
        </div>
    </div>

    <div v-if="hasBlocked">
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 10vh;">
            <div class="card-body">
            <h5 class="card-title">Blocked</h5> 
                <template v-for="(blockedUser, index) in blocked" :key="index">
                    <Blocked :login42="blockedUser"></Blocked>
                </template>
            </div>
        </div>
    </div>
</template>