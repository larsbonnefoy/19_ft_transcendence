<script setup lang="ts"> 
import axios from 'axios'
import {computed, ref} from 'vue'
import {socket} from '../../socket';
import CustomDisplay from './CustomDisplay.vue';
import { useUserStore } from '@/stores/user';
import LiveGame from './LiveGame.vue'

const store = useUserStore();

const emit = defineEmits(['watchGame', 'playGame']);
const dataLoaded = ref(false);

let liveGames: any = Array(0);
async function getOngoingGames() {
    try {
        const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/ongoingGames`);
        liveGames = res.data;
        dataLoaded.value = true;
    }
    catch(error:any) {
        console.log(error.message + ": Pb loading ongoing games")
    }
}

await getOngoingGames();


function watchGame() {
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
    <div v-if="dataLoaded" class="card text-white bg-dark overflow-auto shadow-lg" style="max-width: 70%; margin:auto;">
        <div v-if="liveGames.length != 0" >
            <template v-for="(game, index) in liveGames" :key="index">
              <LiveGame @watch-game="watchGame()" @play-game="playGame()" :player0="game.player0" :player1="game.player1" :score0="game.score0" :score1="game.score1" :room-name="game.roomName"> </LiveGame>
            </template>
        </div>
        <div v-else class="m-3" style="text-align: center;">
            <h3>No games currently live</h3>
        </div>
    </div>

    <!-- Custom visual elements-->
    <div  style="max-width: 70%; margin:auto;">
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