<script setup lang="ts">
import {gameState, socket} from '../../socket'
import {computed} from "vue"


const connectionState = computed(() => {
  return gameState.connected;
})

function connect(){
    socket.connect();
}

function disconnect(){
    socket.disconnect();
}
</script>


<template>
  <p>State: {{ connectionState }}</p>
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
</template>