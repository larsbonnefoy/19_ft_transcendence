<script setup lang="ts">
import {toRef, ref, onMounted, reactive} from 'vue'
import axios from 'axios';
import {type match} from '../../types'
import Game from './Game.vue';

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
</script>

<template>
    <h2> {{username}}'s games </h2>
    <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 42rem; max-height: 50rem;">
        <template v-for="(game, index) in games" :key="index">
            <Game :game-prop="game" :login-prop="login" :username-prop="username"> </Game>
        </template>
    </div>
</template>