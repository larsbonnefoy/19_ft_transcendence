import {reactive} from 'vue';
import { Socket, io } from "socket.io-client";
import { useUserStore } from './stores/user';
import { useToast } from "vue-toastification";
import axios from 'axios';

const URL = `http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}`;

export const socket = io(URL);

socket.on("connect", async () => { //doesnt work as socket is init when app is launched not when user is connected
    console.log(`Connected to server`);
	// const store = useUserStore();
	// (store.user) ? console.log("user connected") : console.log("user not connected");
});

socket.on("disconnect", async () => {
    console.log("Disconnected from server????");
    // const store = useUserStore();
    // await store.setStatus("offline");
    //const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/setStatus:offline`, { headers: {token: localStorage.getItem('jwt_token')} });
    //console.log("res disco here" + res);
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
// function closed() {
//     console.log("toast closed");
// };

// socket.on('notification', (origin: string) => {
//     function clicked() {
//         console.log("toast clicked, send receipt notif to " + origin);
//         socket.emit("acceptChallenge", {target: origin, token: localStorage.getItem('jwt_token')});
//         const router = useRouter();
//         router.push('/game');
//         // router.push({ name: 'game', params: { challenge: 'challenge' } });
//     };
//     const toast = useToast();
// 	toast.warning(origin, {
// 		timeout: 5000,
//         onClick: clicked,
// 		closeOnClick: true,
// 		pauseOnFocusLoss: true,
// 		pauseOnHover: true,
// 		draggable: false,
// 		draggablePercent: 0.6,
// 		showCloseButtonOnHover: false,
// 		hideProgressBar: false,
// 		closeButton: "button",
// 		icon: true,
// 		rtl: false
//     });
// });

socket.on("challenge", (origin: string) => {
    console.log("notif time");
	// const store = useUserStore();
	// console.log(store.user?.username + " received notification: " + origin);
    socket.emit('isInGame', {origin: origin, token: localStorage.getItem('jwt_token')});
});


// //this function is used to confirm a user is online and received the notification you sent them
// socket.on("challengeAccepted", (origin: string) => {
//     const toast = useToast();
// 	toast.info(origin, {
// 		timeout: 5000,
// 		closeOnClick: true,
// 		pauseOnFocusLoss: true,
// 		pauseOnHover: true,
// 		draggable: false,
// 		draggablePercent: 0.6,
// 		showCloseButtonOnHover: false,
// 		hideProgressBar: false,
// 		closeButton: "button",
// 		icon: true,
// 		rtl: false
//     });

//     const router = useRouter();
//     router.push('/game');
//     // router.push({ name: 'game', params: { challenge: 'challenge' } });
// });
    


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