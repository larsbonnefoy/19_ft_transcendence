<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import { type UserInfo } from '@/types';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const store = useUserStore();
const err = ref(false);
const reloadKey = ref(0);

const props = defineProps<{
    pendingUser: UserInfo
}>()

let viewedProfilePending: Array<string> = props.pendingUser.pending;

async function reloadButton() {
    await store.fetchUser();
    reloadKey.value += 1;
}

async function isInPending():Promise<boolean> {
    try {
        const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/pending_list:${props.pendingUser.login42}`)
        viewedProfilePending = res.data.pending;
        if (store.getLogin42) {
            return (viewedProfilePending.includes(store.getLogin42))
        }
    }
    catch (error: any) {
        console.log(error.message);
    }
    return false;
}

/* Define functions before calling it in ref*/
const sendOutReq = ref(await isInPending());


const isPendingRecv = computed(() => {
    return (store.getPending?.includes(props.pendingUser.login42));
})

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
        await store.addFriend(props.pendingUser.login42);
        sendOutReq.value = true;
    }
    catch (error: any){
        await reloadButton();
        console.log(error.message)
    }
}

async function unsendFriendRequest() {
    try {
        await store.unsendFriendRequest(props.pendingUser.login42);
        sendOutReq.value = false;
    }
    catch (error:any){
        sendOutReq.value = false;
        await reloadButton();
        console.log(error.message)
    }
}

async function removeFriend() {
    try {
        await store.removeFriend(props.pendingUser.login42);
    }
    catch (error: any) {
        await reloadButton();
        console.log(error.message);
    }
}

async function confirmRequest() {
    try {
        await store.acceptFriendRequest(props.pendingUser.login42);
    }
    catch (error:any) {
        await reloadButton();
        console.log(error.message);
    }
}

async function declineFriendRequest() {
    try {
        await store.declineFriendRequest(props.pendingUser.login42);
    }
    catch (error:any) {
        await reloadButton();
        console.log(error.message)
    }
}

onMounted(async () => {
    //await getPendingList();
});
</script>

<template :key="reloadKey">
    <div v-if="isPendingRecv">
        <button type="button" class="btn btn-warning mx-3"  @click="confirmRequest"> Accept </button> 
        <button type="button" class="btn btn-outline-warning mx-3"  @click="declineFriendRequest"> Decline  </button>
    </div>
    <div v-else-if="sendOutReq">
        <button type="button" class="btn btn-outline-warning mx-3" @click="unsendFriendRequest"> Unsend </button> <!-- Instead of pending we can display unset -->
    </div>
    <div v-else>
        <button v-if="isFriend" type="button" class="btn btn-danger" @click="removeFriend">Remove</button>
        <button v-else type="button" class="btn btn-success" @click="addFriend">Add Friend</button>
    </div>
    <div v-if="err">
        <p>Oops Something went Wrong, try a refresh bg</p>
    </div>
</template>