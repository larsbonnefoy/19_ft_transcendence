<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import {type match} from '../../types'
import Game from './Game.vue';
import { socket } from '../../socket';


const props = defineProps<{
    usernameProp : string
}>()

const username = toRef(props, "usernameProp");
const succesReqHistory = ref(false);
const games = ref();
const login = ref("");
async function getGames() {
    try {
        const resHistory = await axios.get(`http://localhost:3000/match/history:${username.value}`)
        succesReqHistory.value = true;
        games.value = resHistory.data;

        const resLogin = await axios.get(`http://localhost:3000/user/LogFromUser:${username.value}`)
        login.value = resLogin.data.login42;
    }
    catch (error : any) {
        console.log(error.message);
    }
}
await getGames();

/*
socket.on('endGame', async () => {
    console.log("endGame in Game History");
    await getGames();
    location.reload();
});
*/

onMounted(async () => {
    await getGames();
})
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Games </h2>
    <div  v-if="succesReqHistory" class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
        <template v-for="(game, index) in games.slice().reverse()" :key="index">
            <Game :game-prop="game" :login-prop="login" :username-prop="username"> </Game>
        </template>
    </div>
    <div v-else>
        <h3 style="text-align: center;"> No games played </h3>
    </div>
</template>