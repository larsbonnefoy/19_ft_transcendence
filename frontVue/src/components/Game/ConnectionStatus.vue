<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import {gameState, socket} from '../../socket';
import { computed } from "vue";

const store = useUserStore();

let user = store.getUserName;

const connectionState = computed(() => {
  return gameState.connected;
})

function connect(){
    socket.connect();
}

function disconnect(){
    socket.disconnect();
}

function msg() {
    // const res = socket.emit("events", user, (data) => console.log(data));
    socket.emit("events", user);
    // console.log(res);
}
</script>


<template>
  <p>State: {{ connectionState }}</p>
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
  <button @click="msg()">test?</button>
 <!--<button @click="msg()">Play</button> --> 

</template>