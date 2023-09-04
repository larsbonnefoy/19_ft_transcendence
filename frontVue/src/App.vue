<script setup lang="ts">
import HeaderBar from './components/HeaderBar/HeaderBar.vue'
import { useUserStore } from './stores/user';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { socket } from './socket';
import { onUnmounted } from 'vue';

window.addEventListener("beforeunload", leavingApp);

// const store = useUserStore();
const router = useRouter();

async function leavingApp() {
//   if (store.getUser != null) {
//     store.setStatus("offline");
//   }
}

socket.on('gameNotification', (origin: any) => {
    function clicked() {
        console.log("toast clicked, send receipt notif to " + origin.login42);
        socket.emit("acceptChallenge", {target: origin.login42, token: localStorage.getItem('jwt_token')});
        // router.push({ name: 'game', params: { challenge: 'challenge' } });
    };
    const toast = useToast();
	toast.warning(origin.username + " wants to play !\nClick to join game", {
		timeout: 5000,
        onClick: clicked,
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

//this function is used to confirm a user is online and received the notification you sent them
socket.on("challengeAccepted", () => {
	// console.log("router push /game");
    router.push('/game');
});

socket.on('succesToast', (message: string) => {
	const toast = useToast();
	toast.success(message, {
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

socket.on('warningToast', (message: string) => {
	const toast = useToast();
	toast.warning(message, {
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

socket.on('warning', (message: string) => {
	const toast = useToast();
	toast.error(message, {
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

socket.on('messageToast', (data: any) => {
	const toast = useToast();
	toast.info(data.from + ": " + data.message, {
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

console.log("App.vue loaded");

onUnmounted(async () => {
	socket.off('gameNotification');
	socket.off('challengeAccepted');
	socket.off('succesToast');
	socket.off('warningToast');
	socket.off('warning');
	socket.off('messageToast');
	console.log("App.vue unmounted");
});
</script>

<template>
  <div class="bg-secondary vh-100 text-light">
    <HeaderBar class="h-10"></HeaderBar>
    <Suspense>
      <RouterView class="h-90"></RouterView>
    </Suspense>
  </div>
</template>

<style scoped>
/* .bgColor {
  background-color: #051323;
} */
</style>
