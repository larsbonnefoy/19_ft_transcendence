import {reactive} from 'vue';
import { Socket, io } from "socket.io-client";
import { useUserStore } from './stores/user';
import { useToast } from "vue-toastification";

export const gameState = reactive({
    connected: false, 
});

const URL = "http://localhost:3000"; //TODO set to env variable here

export const socket = io(URL);

socket.on("connect", async () => { //doesnt work as socket is init when app is launched not when user is connected
    console.log(`Connected to server`);
    gameState.connected = true;
	// const store = useUserStore();
	// (store.user) ? console.log("user connected") : console.log("user not connected");
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

socket.on("notification", (response) => {
	const store = useUserStore();
	// console.log(store.user?.username + " received notification: " + response);
	const toast = useToast();
	toast.warning(response, {
		timeout: 5000,
		closeOnClick: true,
		pauseOnFocusLoss: true,
		pauseOnHover: true,
		draggable: false,
		draggablePercent: 0.6,
		showCloseButtonOnHover: false,
		hideProgressBar: false,
		closeButton: "button",
		icon: true,
		rtl: false
	});
});

/*
socket.on("invited") {
    //diplay popup to join or refuse;
    //if join -> go to room
    //else
    //send to inviter that refused
}
*/
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