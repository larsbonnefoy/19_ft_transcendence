import {reactive} from 'vue';
import { Socket, io } from "socket.io-client";
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

/*
export function getSocketInfo(info: SocketInformation): SocketInformation {
    return (info? info : new SocketInformation)
}

class SocketInformation {
    public socket: Socket;

    constructor() {
        this.socket = io(import.meta.env.VITE_BACKEND);

        // You can add event listeners or any other setup here
        this.socket.on('connect', () => {
        console.log('Connected to the server');
        });

        this.socket.on('disconnect', () => {
        console.log('Disconnected from the server');
        });
    }

    sendMessage(message: string) {
        this.socket.emit('event', message);
    }

    close() {
        this.socket.close();
    }
}

export default new SocketInformation();
*/