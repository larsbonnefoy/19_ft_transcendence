<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';
import { GameType } from '../../types';

const props = defineProps<{
    playGame : GameType
}>()


const store = useUserStore();
let isPlayer: boolean = (props.playGame === GameType.PLAYER || props.playGame === GameType.CHALLENGER);


/* GAME */
const canvasWidth = 800;
const canvasHeight = 600;
const key_d = 68;
const key_e = 69;
const key_s = 83;
const key_w = 87;
const key_up = 38;
const key_down = 40;
let player0Login = ref("Player1");
let player1Login= ref("Player2");


let intervalStop : number = -1;
let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let key: number = 0;
let roomIndex : number = -1;
let backgroundColor : string = "black";

function init() {
    socket.on('joinGame', (response : number) => {
        console.log(response + " got this form joingame")
        roomIndex = response;
    });

    socket.on('setAsPlayer', () => {
        isPlayer = true;
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
        player0Login.value = response.player0;
        player1Login.value = response.player1;
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
	intervalStop = setInterval(redrawAll, 20);
}

function redrawAll() {
	if (roomIndex === -1 || !isPlayer)
		return ;
    if (key == key_w) {
        socket.emit("leftPaddle", {dir: -1, roomIndex: roomIndex});
    }
    if (key == key_s) {
        socket.emit("leftPaddle", {dir: 1, roomIndex: roomIndex});
    }
    if (key == key_e) {
        socket.emit("rightPaddle", {dir: -1, roomIndex: roomIndex});
    }
    if (key == key_d) {
        socket.emit("rightPaddle", {dir: 1, roomIndex: roomIndex});
    }
    if (key === key_up) {
        socket.emit("updatePaddle", {dir: -1, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
    }
    if (key === key_down) {
        socket.emit("updatePaddle", {dir: 1, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
    }
    socket.emit('display', roomIndex);
    // socket.emit('events', "test");
}

onMounted(async () => {
    await store.setStatus("ingame");
    // socket.connect(); //we don't connect and disconnect here
    if (props.playGame === GameType.PLAYER) {    //if he joins a game to play this function launches the game, to watch this function is not called
		await store.setStatus("ingame");
        socket.emit('joinGame', localStorage.getItem('jwt_token'));
    } else if (props.playGame === GameType.CHALLENGER) {
        await store.setStatus("ingame");
        console.log("challenger in the place");
        socket.emit('joinGame', localStorage.getItem('jwt_token'));
    }
    init();
})

onUnmounted(async () => {
    clearInterval(intervalStop);
	socket.emit('leaveRoom', {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
    // socket.disconnect();
    await store.setStatus("online");
})
</script>

<template>
    <div class="row" style="max-width: 100vw;">
		<div class="col-2 playerCard">
			<h2> {{ player0Login }} </h2>
		</div>
			<div class="col-8" style="max-height: 90vh; max-width: 90vw;">
                <div id="canvas-container">
                    <canvas id="gameCanvas" class="m-5"></canvas>
                </div>
			</div>
        <div class="col-2 playerCard">
            <h2> {{ player1Login }}</h2>
        </div>
	</div>
</template>

<style scoped>
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