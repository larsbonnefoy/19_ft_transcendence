<script setup lang="ts">
import type { match } from '@/types';
import {computed, ref} from 'vue'
import axios from 'axios';

const props = defineProps<{
    username : string
    login: string
    match : match 
}>()


interface player {
    login42: string
    score: number
}

/*
    Find which player in prop.match is user and which player is opponent
    Check if user has won or lost game
    Change username by login!!!
*/

let opponent: player;
let user: player;
let opponentUsername: string; 

if (props.match.player1 == props.login) {
    user = { login42: props.match.player1, score: props.match.score1};
    opponent = { login42: props.match.player2, score: props.match.score2};
}
else {
    user = { login42: props.match.player2, score: props.match.score2};
    opponent = { login42: props.match.player1, score: props.match.score1};
}

const gameWon = computed(() => {
    return user.score > opponent.score;
})

</script>

<template>
    <li 
  class="list-group-item p-3 border border-dark border-1 text"
  :class="{'list-group-item-success': gameWon, 'list-group-item-danger' : !gameWon}"
  >
  {{ props.username }} : {{ user.score }} | {{ opponent.login42 }} : {{ opponent.score }}
    </li>
</template>

<style scoped>
.text {
    text-align: center;
}
</style>
