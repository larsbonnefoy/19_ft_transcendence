<script setup lang="ts"> 
import axios from 'axios'
import {ref} from 'vue'
import {gameState, socket} from '../../socket';

const emit = defineEmits(['watchGame', 'playGame']);

const liveGames = ref();
async function getOngoingGames() {
    try {
        const res = await axios.get("http://localhost:3000/match/ongoingGames");
        liveGames.value = res.data;
    }
    catch(error) {

    }
}

await getOngoingGames();

function watchGame(roomName: string) {
    socket.emit("watchGame", roomName);         //emit to backend to be appended to right roomm
    emit('watchGame');                       //emit to parent component to load game view
}

function playGame() {
    emit('playGame');
}
</script>

<template>
    <div> 
        <button @click="playGame()">Play Game</button>
    </div>
    <div> 
    <template v-for="(game, index) in liveGames" :key="index">
        {{ game }}
        <button @click="watchGame(game.roomName)">Watch</button>
    </template>
    </div>
</template>