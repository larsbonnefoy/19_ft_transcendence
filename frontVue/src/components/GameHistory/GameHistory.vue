<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import Game from './Game.vue';


const props = defineProps<{
    usernameProp : string
}>()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const succesReqHistory = ref(false);
const games = ref();
const login = ref("");
const isLoaded = ref(false);

async function getGames() {
    try {
        const resHistory = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/history:${props.usernameProp}`);
        games.value = resHistory.data;
        succesReqHistory.value = true;

        const resLogin = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/LogFromUser:${props.usernameProp}`);
        login.value = resLogin.data.login42;
    }
    catch (error : any) {
        console.log(error.message);
    }
    isLoaded.value = true;
}

onMounted(async () => {
    await sleep(500);
    await getGames();
})
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Game history </h2>
    <div v-if="isLoaded"> <!-- display only if login has been fetch-->
        <div  v-if="succesReqHistory" class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
            <template v-for="(game, index) in games.slice().reverse()" :key="index">
                <Game :game-prop="game" :login-prop="login" :username-prop="props.usernameProp"> </Game>
            </template>
        </div>
        <div v-else>
            <h3 style="text-align: center;"> No games played </h3>
        </div>
    </div>
    <div v-else>
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    </div>
</template>