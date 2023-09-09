import { io } from "socket.io-client";

const URL = `http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}`;
// const URL = `http://192.168.1.32:3000`;

export const socket = io(URL)
// , {
	// withCredentials: true,
  	// extraHeaders: {
    // "Access-Control-Allow-Origin": "true"
	// }
// });
// export const socket = io({transports: ['websocket']});

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
