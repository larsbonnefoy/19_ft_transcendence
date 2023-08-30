import {reactive} from 'vue';
import { Socket, io } from "socket.io-client";
import { useUserStore } from './stores/user';
import { useToast } from "vue-toastification";
import axios from 'axios';

const URL = `http://${import.meta.env.VITE_BACK}`;

export const socket = io(URL);

socket.on("connect", async () => {
    console.log(`Connected to server`);
});

socket.on("disconnect", async () => {
    console.log("Disconnected from server");
});

socket.on("doubleConnection", async () => {
    console.log("disconnecting socket because other connection detected");
    socket.disconnect();
    localStorage.clear();
    location.reload();
});

socket.on("events", (response) => {
    console.log("here " + response);
});

socket.on("events", (response) => {
    console.log("endGame " + response);
});

socket.on("challenge", (origin: string) => {
    console.log("notif time");
    socket.emit('isInGame', {origin: origin, token: localStorage.getItem('jwt_token')});
});
