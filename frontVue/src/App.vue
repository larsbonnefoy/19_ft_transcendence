<script setup lang="ts">
import HeaderBar from './components/HeaderBar/HeaderBar.vue'
import { useUserStore } from './stores/user';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { socket } from './socket';

window.addEventListener("beforeunload", leavingApp);

const store = useUserStore();
const router = useRouter();

async function leavingApp() {
  if (store.getUser != null) {
    store.setStatus("offline");
  }
  //set Status to offline
}

socket.on('notification', (origin: string) => {
    function clicked() {
        console.log("toast clicked, send receipt notif to " + origin);
        socket.emit("acceptChallenge", {target: origin, token: localStorage.getItem('jwt_token')});
        router.push('/game/challenge');
        // router.push({ name: 'game', params: { challenge: 'challenge' } });
    };
    const toast = useToast();
	toast.warning(origin, {
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
socket.on("challengeAccepted", (origin: string) => {
    const toast = useToast();
	toast.info(origin, {
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

    router.push('/game/challenge');
    // router.push({ name: 'game', params: { challenge: 'challenge' } });
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
