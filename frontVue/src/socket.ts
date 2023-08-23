import {reactive} from 'vue';
import { io } from "socket.io-client";

export const gameState = reactive({
    connected: false, 
});

const URL = "http://localhost:300"; //TODO set to env variable here

export const socket = io(URL);

socket.on("connect", () => {
    gameState.connected = true;
});

socket.on("disconnect", () => {
    gameState.connected = false;
});