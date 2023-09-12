<script setup lang="ts">
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import GlobalGameHistory from '@/components/Game/GlobalGameHistory.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../socket';
import { useUserStore } from '@/stores/user';
import { GameType } from '@/types';
import axios from 'axios';

const store = useUserStore();
const displayGame = ref(false); //default value should be false
const playGame = ref(GameType.PLAYER);
let windowWidth = ref(window.innerWidth);

let liveGames: any = Array(0);

async function isInGame() {
    try {
        const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/match/startingOngoingGames`);
        liveGames = res.data;
		// console.log(liveGames.length);
		if (liveGames.length != 0 ) {
			// console.log(liveGames);
			for (let games of liveGames) {
				if (games.player0 == store.getLogin42 || games.player1 == store.getLogin42) {
					joinGame();
				}
			}
		}
    }
    catch(error:any) {
        console.log(error.message + ": Pb loading ongoing games")
    }
}

function joinGame() {
	displayGame.value = true;
	playGame.value = GameType.PLAYER;
}

function watchGame() {
	displayGame.value = !displayGame.value
	playGame.value = GameType.WATCHER;
}

function closeCanvas() {
	// console.log("canvas closed");
	displayGame.value = false;
	// socket.emit('leaveRoomSearch', localStorage.getItem('jwt_token'));
};

socket.on('endGame', (roomIndex : number) => {
	console.log("game ended");
	displayGame.value = false;
	socket.emit('leaveRoom', {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
});

socket.on("challengeAcceptedJoinGame", () => { // router.push /game doesn't work if in /game already
    joinGame();
});

function handleResize() {
	windowWidth.value = window.innerWidth;
}

onMounted(async () => {
    window.addEventListener('resize', handleResize);
	await isInGame();
});

onUnmounted(async () => {
    window.removeEventListener('resize', handleResize);
	socket.off('endGame');
	socket.off('challengeAcceptedJoinGame');
});

</script>

<template>
	<div v-if="displayGame"> 
		<Canvas :play-game="playGame" @close-canvas="closeCanvas()"> </Canvas> <!-- init game or watch game-->
	</div>
	<div v-else>
		<div v-if="windowWidth > 800" class="row" style="max-width: 100vw;">
			<div v-if="store.getUserName != undefined" class="col-6">
				<GlobalGameHistory> </GlobalGameHistory>
    		</div>
			<div class="col-6">
				<Actions @watch-game="watchGame()" @play-game="joinGame()"> </Actions>
			</div>
		</div>
		<div v-else class="row">
			<Actions @watch-game="watchGame()" @play-game="joinGame()"> </Actions>
			<div v-if="store.getUserName != undefined">
				<GlobalGameHistory> </GlobalGameHistory>
			</div>
		</div>
	</div>
</template>

<style>
.playerCard {
	text-align: center;
	margin:auto;
}
</style>