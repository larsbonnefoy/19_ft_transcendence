<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import GlobalGame from './GlobalGame.vue';
import { compileString } from 'sass';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const succesReqHistory = ref(false);
const games = ref();
const isLoaded = ref(false);
const page = ref(0);

async function getGames() {
    try {
        const resHistory = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/tenFrom:${page.value * 10}`);
        games.value = resHistory.data;
        succesReqHistory.value = true;
    }
    catch (error : any) {
        console.log(error.message + " No games in that range");
        page.value -= 1;
    }
    isLoaded.value = true;
}

async function getPage(direction: number) {
    isLoaded.value = false;
    if (page.value + direction >= 0) {
        page.value += direction;
        // console.log(page.value);
        await getGames();
        isLoaded.value = true;
    }
    isLoaded.value = true;
}

onMounted(async () => {
    await sleep(1000);
    await getGames();
})
</script>

<template>
    <h2 style="text-align: center; " class="m-5">Global Games</h2>
        <div v-if="isLoaded"> <!-- display only if login has been fetch-->
            <div  v-if="succesReqHistory">
                <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;"> 
                    <template v-for="(game, index) in games" :key="index">
                        <GlobalGame :game-prop="game"> </GlobalGame>
                    </template>
                </div>
                    <div class="row"> 
                        <div class="col-4 m-0 p-0 text-center">
                            <button class="btn btn-outline-dark" @click="getPage(-1)"> prev </button>
                        </div>
                    <div  class="col-4 m-0 p-0 text-center"> 
                        <p style="text-align: center; font-size: 1.5em;"> page: {{ page + 1  }}</p>
                    </div>
                    <div class="col-4 m-0 p-0 text-center">
                        <button class="btn btn-outline-dark" @click="getPage(1)"> next </button>
                    </div>
                </div>
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