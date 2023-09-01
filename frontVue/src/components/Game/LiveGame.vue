<script setup lang="ts">
import axios from 'axios';
import {ref} from 'vue'; 
import { useUserStore } from '@/stores/user';
import {socket} from '../../socket';

const emit = defineEmits(['watchGame', 'playGame']);

const store = useUserStore();

const props = defineProps<{
    player0: string
    player1: string
    score0: number
    score1: number
    roomName: string
}>()

let usernamePlayer0: string;
let usernamePlayer1: string;
const dataLoaded = ref(false);

async function getUsername() {
    try {
        let res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${props.player0}`);
        usernamePlayer0 = res.data.username;
        
        res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${props.player1}`);
        usernamePlayer1 = res.data.username;
        dataLoaded.value = true;
    }
    catch(error:any) {
        console.log(error.message);
    }
}

function watchGame(roomName: string) {
    socket.emit("watchGame",  {roomName: roomName, token: localStorage.getItem('jwt_token')});         //emit to backend to be appended to right roomm
    emit('watchGame');                       //emit to parent component to load game view
}

function playGame() {
    emit('playGame');
}

await getUsername();
</script>

<template>
    <div class="card-body p-0 m-3" style="text-align: center; margin: auto;">
        <div v-if="dataLoaded" class="row">
            <div class="col-1" style="margin: auto;">
            <svg height="50" width="50" class="blinking">
                <circle cx="25" cy="25" r="5" fill="red" />
                Sorry, your browser does not support inline SVG.  
            </svg>
            </div>
            <div class="col-4 p-0 " style="margin: auto;"> {{ usernamePlayer0 }} </div>
            <div class="col-1" style="margin: auto;"> {{ score0 }} </div>
            <div class="col-3 p-0" style="margin: auto;"> {{ usernamePlayer1 }} </div>
            <div class="col-1" style="margin: auto;"> {{ score1 }} </div>
            <div v-if="!(store.getLogin42 === player0 || store.getLogin42 === player1)" class="col-2" style="margin: auto;">
                <button class="btn btn-info" @click="watchGame(roomName)">Watch</button>
            </div>
            <div v-else class="col-2" style="margin: auto">
                <button class="btn btn-outline-success" @click="playGame()">Rejoin Game</button>
            </div>
        </div>
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