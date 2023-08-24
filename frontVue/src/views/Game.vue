<script setup lang="ts">
import ConnectionStatus from '@/components/Game/ConnectionStatus.vue';
import Canvas from '@/components/Game/Canvas.vue';
import Actions from '@/components/Game/Actions.vue'
import LeaderBoard from '@/components/Game/LeaderBoard.vue';
import {ref} from 'vue'

const inGame = ref(false);

</script>

<template>
	<div v-if="inGame"> 
		<div class="row" style="max-width: 100vw;">
			<div class="col-2">
				<p> P1 </p>
				<!-- <ConnectionStatus></ConnectionStatus> -->
			</div>
			<div class="col-8" style="max-height: 90vh; max-width: 90vw">
				<Canvas ></Canvas>
			</div>
			<div class="col-2">
				<p> P2 </p>
			</div>
		</div>
	</div>
	<div v-else>
		<div class="row" style="max-width: 100vw;">
			<div class="col-6"> 				
				<LeaderBoard> </LeaderBoard>
 			</div>
			<div class="col-6">
				<ConnectionStatus> </ConnectionStatus>
				<Actions> </Actions>
			</div>
		</div>
	</div>
</template>
