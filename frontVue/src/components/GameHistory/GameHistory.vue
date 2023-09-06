<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import Game from './Game.vue';
import { GChart } from 'vue-google-charts';
import { useUserStore } from '../../stores/user';
import type { GoogleChartOptions } from 'vue-google-charts/dist/types';


const props = defineProps<{
    usernameProp : string
}>()

const store = useUserStore();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const succesReqHistory = ref(false);
const games = ref();
const chartData = ref();
const chartOptions: GoogleChartOptions | undefined = {
    colors:['lightgreen'],
    title: 'Progression curve',
    titleTextStyle: {
    color: '#FFFFFF'
    },
//   curveType: 'function',
    legend: { position: 'none' },
//   width: 800,
//   height: 600,
    backgroundColor: '#23272b',
    vAxis:{
        textStyle: {
            color: '#FFFFFF'
        },
    },
    hAxis:{
        textStyle: {
            color: '#FFFFFF'
        },
    }
};
const login = ref("");
const isLoaded = ref(false);

async function getGames() {
    try {
        const resHistory = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/history:${props.usernameProp}`);
        games.value = resHistory.data;
        succesReqHistory.value = true;

        const resLogin = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/LogFromUser:${props.usernameProp}`);
        login.value = resLogin.data.login42;

        if (games.value && login.value) {
            chartData.value = [["Games", "Elo"], [0, 1000]];
            let index: number = 1;
            for (let game of games.value) {
                console.log("current game: " + game);
                if (game.player1 === login.value) {
                    chartData.value.push([index, game.elo1]);
                } else {
                    chartData.value.push([index, game.elo2]);
                }
                ++index;
            }
        }
    }
    catch (error : any) {
        console.log(error.message + ": No games played by this user");
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
        <div  v-if="succesReqHistory">
            <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 70vh;">
                <template v-for="(game, index) in games.slice().reverse()" :key="index">
                    <Game :game-prop="game" :login-prop="login" :username-prop="props.usernameProp"> </Game>
                </template>
            </div>
            <div class="card text-white bg-dark overflow-auto shadow-lg m-5">
                <div class="card-body textDisplay p-0 m-3">
                    <GChart type="LineChart" :data="chartData" :options="chartOptions"/>
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