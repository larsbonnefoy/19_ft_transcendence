<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import {socket} from '../../socket';
import { computed } from "vue";

const store = useUserStore();

let user = store.getUserName;

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
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
  <button @click="msg()">test?</button>
 <!--<button @click="msg()">Play</button> --> 
</template>