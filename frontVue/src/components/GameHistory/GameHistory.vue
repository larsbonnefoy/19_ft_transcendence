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

async function getGames() {
    console.log("Get Games for user " + props.usernameProp)
    try {
        const resHistory = await axios.get(`http://${import.meta.env.VITE_BACK}/match/history:${props.usernameProp}`)
        succesReqHistory.value = true;
        games.value = resHistory.data;

        const resLogin = await axios.get(`http://${import.meta.env.VITE_BACK}/user/LogFromUser:${props.usernameProp}`)
        login.value = resLogin.data.login42;
    }
    catch (error : any) {
        console.log(error.message);
    }
}

onMounted(async () => {
    await sleep(500);
    await getGames();
})
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Games </h2>
    <div v-if="login.length != 0"> <!-- display only if login has been fetch-->
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