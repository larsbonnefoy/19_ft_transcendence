<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import GlobalGame from './GlobalGame.vue';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const succesReqHistory = ref(false);
const games = ref();
const isLoaded = ref(false);

async function getGames() {
    try {
        const resHistory = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/tenFrom:0`);
        games.value = resHistory.data;
        succesReqHistory.value = true;
    }
    catch (error : any) {
        console.log(error.message + " no 10 games in history");
    }
    isLoaded.value = true;
}

onMounted(async () => {
    await sleep(1000);
    await getGames();
})
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Last games played on server </h2>
    <div v-if="isLoaded"> <!-- display only if login has been fetch-->
        <div  v-if="succesReqHistory" class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
            <template v-for="(game, index) in games" :key="index">
                <GlobalGame :game-prop="game"> </GlobalGame>
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