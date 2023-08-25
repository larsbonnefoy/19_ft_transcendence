<script setup lang="ts"> 
import axios from 'axios'
import {ref} from 'vue'
import {gameState, socket} from '../../socket';
import CustomDisplay from './CustomDisplay.vue';

const emit = defineEmits(['watchGame', 'playGame']);

let liveGames: any = Array(0);
async function getOngoingGames() {
    try {
        const res = await axios.get("http://localhost:3000/match/ongoingGames");
        liveGames = res.data;
        console.log(liveGames);
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
    <!-- Play a game -->
    <div> 
        <button @click="playGame()">Play Game</button>
    </div>
        <CustomDisplay> </CustomDisplay>
    <!-- Custom visual elements-->
    <div>
    </div>
    <!-- Watch Current Games -->
    <div v-if="liveGames.length != 0" class="card text-white bg-dark overflow-auto shadow-lg" style="max-width: 70%; max-height: 70vh; margin:auto;">
    <template v-for="(game, index) in liveGames" :key="index">
        <div class="card-body p-0 m-3" style="text-align: center; margin: auto;">
            <div class="row">
                <div class="col-4 p-0 " style="margin: auto;"> {{ game.player0  }} </div>
                <div class="col-1" style="margin: auto;"> {{ game.score0 }} </div>
                <div class="col-4 p-0" style="margin: auto;"> {{ game.player1  }} </div>
                <div class="col-1" style="margin: auto;"> {{ game.score1 }} </div>
                <div class="col-2" style="margin: auto;">
                    <button class="btn btn-info" @click="watchGame(game.roomName)">Watch</button>
                </div>
            </div>
        </div>
    </template>
    </div>
    <div v-else style="text-align: center;">
        <h2> No games Currently playing </h2>
    </div>

</template>
