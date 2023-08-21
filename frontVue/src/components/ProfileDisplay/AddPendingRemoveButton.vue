<script setup lang="ts">
import {ref, computed} from 'vue'
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const props = defineProps<{
    profileUsername : string
    profileLogin42: string
    profilePending: string[]
}>()

const isPendingRecv = ref(store.getPending?.includes(props.profileLogin42));

const isPendingSend = ref();
if (store.getLogin42 != undefined) {
    isPendingSend.value = props.profilePending.includes(store.getLogin42);
}


//pt devoir switch ca dans le button direct
const isFriend = computed(() => {
    const index = store.getFriends?.indexOf(props.profileLogin42);
    if (index !== -1) {
        return true;
    }
    return false;
})

async function addFriend() {
    try {
        await store.addFriend(props.profileUsername);
        isPendingSend.value = true;
    }
    catch (error){
        console.log(error)
    }
}

async function removeFriend() {
    await store.removeFriend(props.profileUsername);
}

async function confirmRequest() {
    await store.acceptFriendRequest(props.profileUsername);
    isPendingRecv.value = false;
}

async function declineFriendRequest() {
    await store.declineFriendRequest(props.profileUsername);
    isPendingRecv.value = false;
}
</script>

<template>
    <template v-if="isPendingRecv">
        <button type="button" class="btn btn-warning mx-3"  @click="confirmRequest"> Accept </button> 
        <button type="button" class="btn btn-outline-warning mx-3"  @click="declineFriendRequest"> Decline  </button>
    </template>
    <template v-else-if="isPendingSend">
        <button type="button" class="btn btn-outline-warning mx-3"> Pending </button>
    </template>
    <template v-else>
        <button v-if="isFriend" type="button" class="btn btn-danger" @click="removeFriend">Remove</button>
        <button v-else type="button" class="btn btn-success" @click="addFriend">Add Friend</button>
    </template>
</template>