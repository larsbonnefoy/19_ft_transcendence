<script setup lang="ts"> 
import axios from 'axios'
import {computed, ref} from 'vue'
import {socket} from '../../socket';
import CustomDisplay from './CustomDisplay.vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const emit = defineEmits(['watchGame', 'playGame']);

let liveGames: any = Array(0);
async function getOngoingGames() {
    try {
        const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/ongoingGames`);
        liveGames = res.data;
    }
    catch(error) {

    }
}

await getOngoingGames();

function watchGame(roomName: string) {
    socket.emit("watchGame",  {roomName: roomName, token: localStorage.getItem('jwt_token')});         //emit to backend to be appended to right roomm
    emit('watchGame');                       //emit to parent component to load game view
}

function playGame() {
    emit('playGame');
}
</script>

<template>
    <!-- Play a game -->
    <div class="text-center m-5"> 
        <button class="btn btn-success" @click="playGame()">Play Game</button>
    </div>
    <!-- Watch Current Games -->
    <div class="card text-white bg-dark overflow-auto shadow-lg" style="max-width: 70%; margin:auto;">
        <div v-if="liveGames.length != 0" >
            <template v-for="(game, index) in liveGames" :key="index">
                <div class="card-body p-0 m-3" style="text-align: center; margin: auto;">
                    <div class="row">
                        <div class="col-1" style="margin: auto;">
                        <svg height="50" width="50" class="blinking">
                            <circle cx="25" cy="25" r="5" fill="red" />
                            Sorry, your browser does not support inline SVG.  
                        </svg>
                        </div>
                        <div class="col-4 p-0 " style="margin: auto;"> {{ game.player0  }} </div>
                        <div class="col-1" style="margin: auto;"> {{ game.score0 }} </div>
                        <div class="col-3 p-0" style="margin: auto;"> {{ game.player1  }} </div>
                        <div class="col-1" style="margin: auto;"> {{ game.score1 }} </div>
                        <div v-if="!(store.getLogin42 === game.player0 || store.getLogin42 === game.player1)" class="col-2" style="margin: auto;">
                            <button class="btn btn-info" @click="watchGame(game.roomName)">Watch</button>
                        </div>
                        <div v-else class="col-2" style="margin: auto">
                          <button class="btn btn-outline-success" @click="playGame()">Rejoin Game</button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div v-else class="m-3" style="text-align: center;">
            <h3>No games currently live</h3>
        </div>
    </div>

    <!-- Custom visual elements-->
    <div  style="max-width: 70%; max-height: 30vh; margin:auto;">
        <CustomDisplay> </CustomDisplay>
    </div>
   

</template>


<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.blinking {
  -webkit-animation: 1s blink ease infinite;
  -moz-animation: 1s blink ease infinite;
  -ms-animation: 1s blink ease infinite;
  -o-animation: 1s blink ease infinite;
  animation: 1s blink ease infinite;
  
}

@keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-moz-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-webkit-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-ms-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-o-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>