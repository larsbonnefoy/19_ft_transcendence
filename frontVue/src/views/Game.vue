<script setup lang="ts">
import ConnectionStatus from '@/components/Game/ConnectionStatus.vue';
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import LeaderBoard from '@/components/Game/LeaderBoard.vue';
import {ref} from 'vue';
import { socket } from '../socket';
import { useUserStore } from '@/stores/user';
import {useRoute} from 'vue-router';
import { GameType } from '@/types';

const route = useRoute();

const displayGame = ref(false);
const playGame = ref(GameType.PLAYER);

// console.log(route.path);
if (route.path === "/game/challenge") {
	displayGame.value = true;
	playGame.value = GameType.CHALLENGER;
}

const store = useUserStore();

function joinGame() {
	displayGame.value = true;
	playGame.value = GameType.PLAYER;
}

function watchGame() {
	displayGame.value = !displayGame.value
	playGame.value = GameType.WATCHER;
}

socket.on('endGame', (roomIndex) => {
	console.log("game ended");
	store.setStatus("online"); //set status to online when gameIsEnded (in socket.ts)
	displayGame.value = false;
	socket.emit('leaveRoom', {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
});

</script>

<template>
	<div v-if="displayGame"> 
		<Canvas :play-game="playGame"> </Canvas> <!-- init game or watch game-->
	</div>
	<div v-else>
		<!-- <button @click="joinGame()">Toggle Mode</button> -->
		<div class="row" style="max-width: 100vw;">
			<div class="col-6"> 				
				<LeaderBoard> </LeaderBoard>
 			</div>
			<div class="col-6">
				<Actions @watch-game="watchGame()" @play-game="joinGame()"> </Actions>
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