<script setup lang="ts">
import ConnectionStatus from '@/components/Game/ConnectionStatus.vue';
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import LeaderBoard from '@/components/Game/LeaderBoard.vue';
import {ref} from 'vue';
import { socket } from '../socket';
import { useUserStore } from '@/stores/user';


const displayGame = ref(false);
const playGame = ref(false);


const store = useUserStore();

function joinGame() {
	displayGame.value = !displayGame.value
	playGame.value = !playGame.value;
}

function watchGame() {
	displayGame.value = !displayGame.value
}

socket.on('endGame', () => {
	console.log("game ended");
	store.setStatus("online"); //set status to online when gameIsEnded (in socket.ts)
	displayGame.value = false;
});

</script>

<template>
	<div> 
	<p> displayGame {{ displayGame }} </p>
	<p> playGame {{ playGame }} </p>
	</div>
	<div v-if="displayGame"> 
		<div class="row" style="max-width: 100vw;">
			<div class="col-2 playerCard">
				<h2> Player 1 </h2>
				<!-- <button @click="joinGame()">Toggle Mode</button>-->
			</div>
			<div class="col-8" style="max-height: 90vh; max-width: 90vw;">
				<Canvas :play-game="playGame"> </Canvas> <!-- init game or watch game-->
			</div>
			<div class="col-2 playerCard">
				<h2> Player 2 </h2>
			</div>
		</div>
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