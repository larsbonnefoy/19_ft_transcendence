import {reactive} from 'vue';
import { io } from "socket.io-client";

export const gameState = reactive({
    connected: false, 
});

const URL = "http://localhost:3000"; //TODO set to env variable here

export const socket = io(URL);

socket.on("connect", () => {
    console.log(`Connected to server`);
    gameState.connected = true;
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
    gameState.connected = false;
});

socket.on("events", (response) => {
    console.log("here " + response);
});