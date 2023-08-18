<script setup lang="ts">
import {type match} from '../../types'
import { toRef, computed} from 'vue';
import axios from 'axios';

const props = defineProps<{
    gameProp : match
    loginProp: string
    usernameProp: string
}>()

interface player {
    login42: string
    score: number
}

const game = toRef(props, "gameProp");
const login = toRef(props, "loginProp");
const username = toRef(props, "usernameProp");

let opponent: player;
let user: player;
let opponentUsername: string;
let opponentElo: number;

async function setUserOpponent() {
    if (game.value.player1 == login.value) {
        user = { login42:game.value.player1, score:game.value.score1};
        opponent = { login42:game.value.player2, score:game.value.score2};
    }
    else {
        user = {  login42:game.value.player2, score:game.value.score2};
        opponent = { login42:game.value.player1, score:game.value.score1};
    }
    //console.log("user");
    //console.log(user);
    //console.log("opponent");
    //console.log(opponent);
    try {
        const resUsername = await axios.get(`http://localhost:3000/user/UserFromLog:${opponent.login42}`)
        const resElo = await axios.get(`http://localhost:3000/user/getElo:${opponent.login42}`)
        opponentUsername = resUsername.data.username;
        opponentElo = resElo.data.elo;
    }
    catch (error) {
        console.log(error)
    }
}

const gameWon = computed(() => {
    return user.score > opponent.score;
})

await setUserOpponent();

</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        <div class="row">
        <div class="col-5 p-0"> {{ username }} : {{ user.score }} </div>
        <div v-if="gameWon" class="col-2 p-0 gameWon"> Won </div>
        <div v-else class="col-2 p-0 gameLost"> Lost </div>
        <div class="col-5 p-0">  {{ opponentUsername }} : {{ opponent.score }} <span class="eloDisplay mx-1">({{ Math.ceil(opponentElo)}}) </span></div>
        </div>
    </div>
</template>

<style scoped>
.textDisplay {
    font-size: large;
    font-weight: bolder;
    text-align: center;
}

.eloDisplay {
    font-size: medium;
    font-weight: 400;
    color: grey;
}
.gameWon {
    color: green;
}

.gameLost {
    color: red;
}
</style>