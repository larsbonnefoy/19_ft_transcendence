<script setup lang="ts">
import {ref, computed} from 'vue'
import { type UserInfo } from '@/types';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const err = ref(false);
const sendOutReq = ref(false);

const props = defineProps<{
    pendingUser: UserInfo
}>()

//const isPendingRecv = ref(store.getPending?.includes(props.pendingUser.login42));
const isPendingRecv = computed(() => {
    return (store.getPending?.includes(props.pendingUser.login42));
})

/* Pb c'est que l'autre user n'est pas mis a jour donc on a pas ses infos */
/* => le button add ne change pas quand une request est send */
const isPendingSend = computed(() => {
    if (store.getLogin42) {
        return (props.pendingUser.pending.includes(store.getLogin42) || sendOutReq.value);
    }
})

/*
if (store.getLogin42 != undefined) {
    isPendingSend.value = props.pendingUser.pending.includes(store.getLogin42);
}
*/

//pt devoir switch ca dans le button direct
const isFriend = computed(() => {
    if (store.getLogin42) {
        if (store.getFriends?.includes(props.pendingUser.login42)) {
            return 1;
        }
    }
    return false;
})

async function addFriend() {
    try {
        await store.addFriend(props.pendingUser.username);
        sendOutReq.value = true;
    }
    catch (error){
        location.reload();
        console.log(error)
    }
}

async function removeFriend() {
    try {
        await store.removeFriend(props.pendingUser.username);
    }
    catch (error) {
        location.reload();
        console.log(error);
    }
}

async function confirmRequest() {
    try {
        await store.acceptFriendRequest(props.pendingUser.username);
        //isPendingRecv.value = false;
    }
    catch (error) {
        /* If already friends, forces reload of page, could just append to list */
        location.reload();
        console.log(error);
    }
}

async function declineFriendRequest() {
    try {
        await store.declineFriendRequest(props.pendingUser.username);
        //isPendingRecv.value = false;
    }
    catch (error) {
        location.reload();
        console.log(error)
    }
}
</script>

<template>
        <div v-if="isPendingRecv">
            <button type="button" class="btn btn-warning mx-3"  @click="confirmRequest"> Accept </button> 
            <button type="button" class="btn btn-outline-warning mx-3"  @click="declineFriendRequest"> Decline  </button>
        </div>
        <div v-else-if="isPendingSend">
            <button type="button" class="btn btn-outline-warning mx-3"> Pending </button> <!-- Instead of pending we can display unset -->
        </div>
        <div v-else>
            <button v-if="isFriend" type="button" class="btn btn-danger" @click="removeFriend">Remove</button>
            <button v-else type="button" class="btn btn-success" @click="addFriend">Add Friend</button>
        </div>
        <div v-if="err">
            <p>Oops Something went Wrong, try a refresh bg</p>
        </div>
</template>