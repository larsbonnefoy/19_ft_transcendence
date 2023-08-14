<script setup lang="ts">
import {ref, computed} from 'vue'
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const store = useUserStore();

const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()

//pt devoir switch ca dans le button direct
const isFriend = computed(() => {
    const index = store.getFriends?.indexOf(props.profileLogin42);
    if (index !== -1) {
        return true;
    }
    return false;
})

async function addFriend() {
    await store.addFriend(props.profileUsername);
}

async function removeFriend() {
    await store.removeFriend(props.profileUsername);
}

</script>

<template>
    <button v-if="isFriend" type="button" class="btn btn-danger" @click="removeFriend">Remove</button>
    <button v-else type="button" class="btn btn-success" @click="addFriend">Add Friend</button>
</template>