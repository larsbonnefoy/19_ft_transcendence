<script setup lang="ts">
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import GameHistory from '@/components/GameHistory/GameHistory.vue';
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

function closeCanvas() {
	console.log("canvas closed");
	displayGame.value = false;
	// socket.emit('leaveRoomSearch', localStorage.getItem('jwt_token'));
	store.setStatus("online");
};

socket.on('endGame', (roomIndex) => {
	console.log("game ended");
	displayGame.value = false;
	socket.emit('leaveRoom', {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
	store.setStatus("online");
});

</script>

<template>
	<div v-if="displayGame"> 
		<Canvas :play-game="playGame" @close-canvas="closeCanvas()"> </Canvas> <!-- init game or watch game-->
	</div>
	<div v-else>
		<div class="row" style="max-width: 100vw;">
			<!-- 
			<div class="col-6"> 				
				<LeaderBoard> </LeaderBoard>
 			</div>
			-->
			<div v-if="store.getUserName != undefined" class="col-6">
				<GameHistory
					:username-prop="store.getUserName"> 
				</GameHistory>
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