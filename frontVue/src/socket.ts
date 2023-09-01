import { io } from "socket.io-client";

const URL = `http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}`;

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

socket.on("challenge", (origin: string) => {
    console.log("notif time");
    socket.emit('isInGame', {origin: origin, token: localStorage.getItem('jwt_token')});
});
