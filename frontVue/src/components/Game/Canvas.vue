<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';
import { GameType } from '../../types';
import GamePlayerCard from './GamePlayerCard.vue';

const props = defineProps<{
    playGame : GameType
}>()

const emit = defineEmits(['closeCanvas']);

const store = useUserStore();
let isPlayer: boolean = (props.playGame === GameType.PLAYER || props.playGame === GameType.CHALLENGER);
const backGrounds : Array<string> = ["black", "Tennis1", "Tennis2", "FootBallField", "Avatar"];


const player0Connected = computed(() => {
    return player0Login.value != "Player1"
})

const player1Connected = computed(() => {
    return (player1Login.value != "Player2" && player1Login.value != "")
})

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

const diff = ref(0);

function init() {
    socket.on('joinGame', (response : number) => {
        console.log(response + " got this form joingame")
        roomIndex = response;
    });

    // socket.on('setAsPlayer', () => {
    //     console.log("becomes player");
    //     isPlayer = true;
    // });

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
        if (roomIndex === -1)
            roomIndex = response.roomName[response.roomName.length - 1];
        if (isPlayer === false && (store.getLogin42 === response.player0 || store.getLogin42 === response.player1))
            isPlayer = true;
        if (player0Login.value === "Player1")
            player0Login.value = response.player0;
        if (player1Login.value === "Player2")
            player1Login.value = response.player1;
        ctx.fillStyle = backgroundColor;
        
        let tmpBg: string | null = localStorage.getItem('backGround');
        if (tmpBg === "black" || tmpBg === null || tmpBg === undefined) {
            ctx.beginPath();
            ctx.fillStyle = tmpBg;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.closePath();
        }
        else {
            let backGroundSelect : string = "";
            let drawBg: boolean = true;
            switch(tmpBg) {
                case(backGrounds[1]):
                    backGroundSelect = "backgroundImage1";
                    break;
                case(backGrounds[2]):
                    backGroundSelect = "backgroundImage2";
                    break;
                case(backGrounds[3]):
                    backGroundSelect = "backgroundImage3";
                    break;
                case(backGrounds[4]):
                    backGroundSelect = "backgroundImage4";
                    break;
                default:
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    ctx.closePath();
                    drawBg = false;
            }
            if (drawBg) { 
                var img = document.getElementById(backGroundSelect);
                if (img)
                    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            }
        }

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
        
        if (response.state === 1) { // === states.ONGOING from backnest
            diff.value = new Date().getTime() - response.lastTimeStamp;
        }
    });
	intervalStop = setInterval(redrawAll, 20);
}

function redrawAll() {
    console.log("room " + roomIndex + ", player " + isPlayer);
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

let leaveRoom = (async () => {
    emit('closeCanvas');
});

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
    <img id="backgroundImage1" src="../../../assets/GameBackGrounds/Tennis1.jpg" hidden>
	<img id="backgroundImage2" src="../../../assets/GameBackGrounds/Tennis2.jpg" hidden>
	<img id="backgroundImage3" src="../../../assets/GameBackGrounds/FootBallField.jpg" hidden>
    <img id="backgroundImage4" :src=store.getImg hidden>
    <div class="row" style="max-width: 100vw;">
		<div class="col-2"  style="display:grid; place-items: center;">
            <template v-if="player0Connected">
                <GamePlayerCard :login42="player0Login"> </GamePlayerCard>
            </template>
		</div>
        <div class="col-8" style="max-height: 90vh; max-width: 90vw;">
            <div class="text-center m-3">
                <button type="button" class="btn btn-danger" @click="leaveRoom">Leave room</button>
            </div>
            <div id="canvas-container">
                <canvas id="gameCanvas" class="m-5"></canvas>
            </div>
            <div style="text-align: center;"> 
                <p> Latency: {{ diff }}ms</p> <!-- Refresh less or ceil value, only display spikes im ms-->
            </div>
        </div>
        <div class="col-2" style="display:grid; place-items: center;">
            <template v-if="player1Connected">
                <GamePlayerCard :login42="player1Login"> </GamePlayerCard>
            </template>
            <template v-else> 
                <div class="d-flex justify-content-center">
                    <p class="m-1"> Searching Opponent </p>
                    <div class="spinner-border" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            </template>
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