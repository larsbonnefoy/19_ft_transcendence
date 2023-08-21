<script setup lang="ts">
import GameHistory from '@/components/Matches/GameHistory.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
const store = useUserStore();

/* ATM ingame/online triggered when going to GAME menu */
const gameCanvas = ref(null)




/* GAME */
const canvasWidth = 800
const canvasHeight = 600
let ctx: any = null;

function init() {
    const canvas = <HTMLCanvasElement>document.getElementById('c-game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.backgroundColor = "#FFFFFF";
}


onMounted(async () => {
    await store.setStatus("ingame");
    init();
})

onUnmounted(async () => {
    await store.setStatus("online");
})
</script>

<template>
    <h1> Game Page </h1>
    <canvas id="c-game-canvas" ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <!-- <script src="game.js"></script>-->
</template>

<style>
</style>
