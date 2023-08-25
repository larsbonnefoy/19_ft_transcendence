<script setup lang="ts"> 
import axios from 'axios'
import {ref} from 'vue'
import {gameState, socket} from '../../socket';

const liveGames = ref();
async function getOngoingGames() {
    try {
        const res = await axios.get("http://localhost:3000/match/ongoingGames");
        console.log(res.data);
        liveGames.value = res.data;
    }
    catch(error) {

    }
}

await getOngoingGames();


function watchGame(roomName: string) {
    // const res = socket.emit("events", user, (data) => console.log(data));
    socket.emit("watchGame", roomName);
    //setstatus Watching
    // console.log(res);
}
</script>

<template>
    {{ liveGames }}
    <p> Play Game  </p>
    <template v-for="(game, index) in liveGames" :key="index">
        <button @click="watchGame(game.roomName)">Watch</button>
    </template>
</template>