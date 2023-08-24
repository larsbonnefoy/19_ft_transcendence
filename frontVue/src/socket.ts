import {reactive} from 'vue';
import { io } from "socket.io-client";
import { useUserStore } from './stores/user';
export const gameState = reactive({
    connected: false, 
});


const URL = "http://localhost:3000"; //TODO set to env variable here

export const socket = io(URL);

socket.on("connect", async () => { //doesnt work as socket is init when app is launched not when user is connected
    console.log(`Connected to server`);
    const store = useUserStore();
    //await store.setStatus("online");
    console.log(store.getStatus);
    gameState.connected = true;
});

socket.on("disconnect", async () => {
    console.log("Disconnected from server");
    const store = useUserStore();
    await store.setStatus("offline");
    gameState.connected = false;
});

socket.on("events", (response) => {
    console.log("here " + response);
});