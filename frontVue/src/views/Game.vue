<script setup lang="ts">
import ConnectionStatus from '@/components/Game/ConnectionStatus.vue';
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import LeaderBoard from '@/components/Game/LeaderBoard.vue';
import {ref} from 'vue';
import { socket } from '../socket';
import { useUserStore } from '@/stores/user';
const inGame = ref(false);

const store = useUserStore();

function displayGame() {
	inGame.value = !inGame.value
}

socket.on('endGame', () => {
	console.log("game ended");
	store.setStatus("online"); //set status to online when gameIsEnded (in socket.ts)
	inGame.value = false;
});

</script>

<template>
	<div v-if="inGame"> 
		<div class="row" style="max-width: 100vw;">
			<div class="col-2 playerCard">
				<h2> Player 1 </h2>
				<button @click="displayGame()">Toggle Mode</button>
			</div>
			<div class="col-8" style="max-height: 90vh; max-width: 90vw;">
				<Canvas> </Canvas>
			</div>
			<div class="col-2 playerCard">
				<h2> Player 2 </h2>
			</div>
		</div>
	</div>
	<div v-else>
		<button @click="displayGame()">Toggle Mode</button>
		<div class="row" style="max-width: 100vw;">
			<div class="col-6"> 				
				<LeaderBoard> </LeaderBoard>
 			</div>
			<div class="col-6">
				<Actions> </Actions>
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