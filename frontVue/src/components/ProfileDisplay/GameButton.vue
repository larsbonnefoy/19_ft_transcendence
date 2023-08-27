<script setup lang="ts">
import {useRouter} from 'vue-router';
import { socket } from '../../socket';

const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()

const router = useRouter();

async function invGame() {
   router.push("/game");
   socket.emit("sendNotification", {target: props.profileLogin42, token: localStorage.getItem('jwt_token')});
}
</script>

<template>
    <button type="button" class="btn btn-outline-success" @click="invGame">Invite Game</button>
</template>