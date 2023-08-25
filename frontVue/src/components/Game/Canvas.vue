<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';


const props = defineProps<{
    playGame : boolean
}>()


const store = useUserStore();


/* GAME */
const canvasWidth = 800;
const canvasHeight = 600;
const key_d = 68;
const key_e = 69;
const key_s = 83;
const key_w = 87;
const key_up = 38;
const key_down = 40;


let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let key: number = 0;
let roomName : string = "";
let backgroundColor : string = "black";

function init() {
    socket.on('joinGame', (response : string) => {
        console.log(response + " got this form joingame")
        roomName = response;
    });

    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.backgroundColor = "#FFFFFF";
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	
	window.addEventListener('keydown', function (e: any) {
        key = e.keyCode;
        // console.log(key);
    });
	window.addEventListener('keyup', function (e: any) {
        key = 0;
    });

    socket.on('display', (response : any) => {
        console.log("display update on room " + roomName);
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.beginPath();
        ctx.rect(response.leftPaddle.x - response.leftPaddle.width / 2, response.leftPaddle.y - response.leftPaddle.height / 2, response.leftPaddle.width, response.leftPaddle.height);
        let color : string | null = localStorage.getItem('leftPaddleColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.rect(response.rightPaddle.x - response.rightPaddle.width / 2, response.rightPaddle.y - response.rightPaddle.height / 2, response.rightPaddle.width, response.rightPaddle.height);
        color = localStorage.getItem('rightPaddleColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(response.ball.x, response.ball.y, response.ball.radius, 0, 2 * Math.PI);
        color = localStorage.getItem('ballColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fillStyle = localStorage.getItem('ballColor');
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
        socket.emit("leftPaddle", {dir: -1, roomName: roomName});
    }
    if (key == key_s) {
        socket.emit("leftPaddle", {dir: 1, roomName: roomName});
    }
    if (key == key_e) {
        socket.emit("rightPaddle", {dir: -1, roomName: roomName});
    }
    if (key == key_d) {
        socket.emit("rightPaddle", {dir: 1, roomName: roomName});
    }
    if (key === key_up) {
        socket.emit("updatePaddle", {dir: -1, roomName: roomName, token: localStorage.getItem('jwt_token')});
    }
    if (key === key_down) {
        socket.emit("updatePaddle", {dir: 1, roomName: roomName, token: localStorage.getItem('jwt_token')});
    }
    socket.emit('display', roomName);
    // socket.emit('events', "test");
}

onMounted(async () => {
    socket.connect();
    await store.setStatus("ingame");
    if (props.playGame) {    //if he joins a game to play this function launches the game, to watch this function is not called
        socket.emit('joinGame', localStorage.getItem('jwt_token'));
    }
    init();
})

onUnmounted(async () => {
    socket.disconnect();
    // await store.setStatus("online"); //set status to online when gameIsEnded (in socket.ts)
})
</script>

<template>
    <div id="canvas-container">
        <canvas id="gameCanvas" class="m-5"></canvas>
    </div>
</template>

<style>
#canvas-container {
   width: 100%;
   text-align:center;
}
#gameCanvas {
    display: inline;
    width: 80%;
	height: 80%;
}
</style>