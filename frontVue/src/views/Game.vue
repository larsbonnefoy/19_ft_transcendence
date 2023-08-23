<script setup lang="ts">
import ConnectionStatus from '@/components/Game/ConnectionStatus.vue';
import Canvas from '@/components/Game/Canvas.vue';

</script>

<template>
	<div class="row" style="max-width: 100vw;">
		<div class="col-2">
			<p> P1 </p>
			<!-- <ConnectionStatus></ConnectionStatus> -->
		</div>
		<div class="col-8" style="max-height: 90vh; max-width: 90vw">
			<p> Game </p>
			<Canvas></Canvas>
		</div>
		<div class="col-2">
			<p> P2 </p>
		</div>
	</div>
</template>
