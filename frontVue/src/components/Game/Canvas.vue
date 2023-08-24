<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';
const store = useUserStore();

/* GAME */
const canvasWidth = 800;
const canvasHeight = 600;
const key_d = 68;
const key_e = 69;
const key_s = 83;
const key_w = 87;


let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let key: number = 0;


function init() {
    socket.emit('startGame');
    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.backgroundColor = "#FFFFFF";
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	
	window.addEventListener('keydown', function (e: any) {
        key = e.keyCode;
    });
	window.addEventListener('keyup', function (e: any) {
        key = 0;
    });

    socket.on('display', (response : any) => {
        console.log(response.leftPaddle.y);
        ctx.fillStyle = response.background;
        ctx.beginPath();
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.beginPath();
        ctx.rect(response.leftPaddle.x - response.leftPaddle.width / 2, response.leftPaddle.y - response.leftPaddle.height / 2, response.leftPaddle.width, response.leftPaddle.height);
        ctx.fillStyle = response.leftPaddle.color;
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.rect(response.rightPaddle.x - response.rightPaddle.width / 2, response.rightPaddle.y - response.rightPaddle.height / 2, response.rightPaddle.width, response.rightPaddle.height);
        ctx.fillStyle = response.rightPaddle.color;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(response.ball.x, response.ball.y, response.ball.radius, 0, 2 * Math.PI);
        ctx.fillStyle = response.ball.color;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.fillText(response.score0, canvasWidth / 4, canvasHeight / 8);
        ctx.fillText(response.score1, 3 * canvasWidth / 4, canvasHeight / 8);
    });

    setInterval(redrawAll, 20);
}

function redrawAll() {
    if (key == key_w) {
        socket.emit("leftPaddle", -1);
    }
    if (key == key_s) {
        socket.emit("leftPaddle", 1);
    }
    if (key == key_e) {
        socket.emit("rightPaddle", -1);
    }
    if (key == key_d) {
        socket.emit("rightPaddle", 1);
    }
    socket.emit('display');
}
onMounted(async () => {
    await store.setStatus("ingame"); //set status to online when gameIsEnded (in socket.ts)
})

onUnmounted(async () => {
    await store.setStatus("online"); //set status to online when gameIsEnded (in socket.ts)
})
</script>

<template>
    <canvas id="gameCanvas"></canvas>
</template>

<style>
#gameCanvas {
	width: 90%;
	height: 90%;
}
</style>