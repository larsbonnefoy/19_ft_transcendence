<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';
import { GameType } from '../../types';
import GamePlayerCard from './GamePlayerCard.vue';
import _default from 'pinia-plugin-persistedstate';

const props = defineProps<{
    playGame : GameType
}>()

const emit = defineEmits(['closeCanvas']);

const store = useUserStore();
const isPlayer: boolean = props.playGame === GameType.PLAYER;
const backGrounds : Array<string> = ["black", "Tennis1", "Tennis2", "FootBallField", "Avatar"];
const newMessage = ref("");
const displayChat = ref(true);
const refreshMsg = ref(0);
let viewerMessages : Array<string> = [];


let windowWidth = ref(window.innerWidth);

function handleResize() {
	windowWidth.value = window.innerWidth;
}

const player0Connected = computed(() => {
    return (player0Login.value != "Player1" && player0Login.value != "");
})

const player1Connected = computed(() => {
    return (player1Login.value != "Player2" && player1Login.value != "");
})

/* GAME */
const canvasWidth: number = 800;
const canvasHeight: number = 600;
const key_a: number = 65;
const key_b: number = 66;
const key_s: number = 83;
const key_w: number = 87;
const key_left: number = 37;
const key_up: number = 38;
const key_right: number = 39;
const key_down: number = 40;
let player0Login = ref("Player1");
let player1Login= ref("Player2");
let lastLatencyUpdate = new Date().getTime();
let lucasSheat: string = "";
let sensi: number = 1;

let intervalStop : number = -1;
let watcherTimeStamp : number = -1;
let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let key: number = 0;
let roomIndex : number = -1;

const diff = ref(0);
const viewers = ref(0);

function hideChat() {
    displayChat.value = false;
    socket.emit('hideChat', localStorage.getItem('jwt_token'));
}

function sendViewerMessage() {
    if (newMessage.value && newMessage.value.trim().length !== 0) {
        socket.emit('viewerMessage', {roomIndex: roomIndex, message:newMessage.value, username: store.getUserName});
        // console.log("message sent: " + newMessage.value);
    }
    let doc = document.getElementById("MessageBox") as HTMLElement;;
    if (doc) {
        nextTick(() => doc.focus());
        // console.log(doc);
        // doc.focus();
    }
    // console.log(doc);
    // document.getElementById("MessageBox")?.focus();
    newMessage.value = "";
}

function receiveViewerMessage(data: any) {
    viewerMessages.push(data.username + ": " + data.message);
    if (viewerMessages.length > 10) {
        viewerMessages.shift();
    }
    refreshMsg.value++;
    // console.log("message received from " + data.username + ": " + data.message);
}

function keyDown(event: any) {
    key = event.keyCode;
}

function getSensi() {
    const sensiStorage = localStorage.getItem("paddle_sensitivity");
    if (sensiStorage == null || +sensiStorage < 0.1 || +sensiStorage > 1.9) {
        sensi = 1;
    }
    else {
        sensi = +sensiStorage;
    }
}

function keyUp(event: any) {
    key = 0;
    if (roomIndex === -1 || !isPlayer)
        return ;
    switch (event.keyCode) {
        case (key_up):
            if (lucasSheat === "u")
                lucasSheat += 'u';
            else
                lucasSheat = "u";
            break ;
        case (key_down):
            if (lucasSheat === "uu" || lucasSheat === "uud")
                lucasSheat += 'd';
            else
                lucasSheat = "";
            break ;
        case (key_left):
            if (lucasSheat === "uudd" || lucasSheat === "uuddlr")
                lucasSheat += 'l';
            else
                lucasSheat = "";
            break ;
        case (key_right):
            if (lucasSheat === "uuddl" || lucasSheat === "uuddlrl")
                lucasSheat += 'r';
            else
                lucasSheat = "";
            break ;
        case (key_b):
            if (lucasSheat === "uuddlrlr")
                lucasSheat += 'b';
            else
                lucasSheat = "";
            break ;
        case (key_a):
            if (lucasSheat === "uuddlrlrb")
                socket.emit("win", {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
            lucasSheat = "";
            break ;
        default:
            lucasSheat = "";
    }
}

function updateRoomIndex(response : number) {
    // console.log("joingame in room " + response);
    roomIndex = response;
}

function init() {
    socket.on('joinGame', updateRoomIndex);

    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (canvas === null || canvas === undefined)
        return ;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.backgroundColor = "#FFFFFF";
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	
	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyUp);

    socket.on('receiveViewerMessage', receiveViewerMessage);

    socket.on('display', (response : any) => {
        if (roomIndex === -1) {
            roomIndex = response.roomName[response.roomName.length - 1];
		}
		if (!isPlayer) {
			watcherTimeStamp = response.lastTimeStamp;
		}
        if (response.player0 != player0Login.value) {
            player0Login.value = response.player0;
		}
        if (response.player1 != player1Login.value) {
            player1Login.value = response.player1;
        }
        
        let tmpBg: string | null = localStorage.getItem('backGround');
        if (tmpBg === "black" || tmpBg === null || tmpBg === undefined) {
            ctx.beginPath();
            ctx.fillStyle = "black";
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

        color = localStorage.getItem('ballColor'); //we use ballColor for obstacles too
		if (color === "gold" && +response.state === 1)
			socket.emit('gold', localStorage.getItem('jwt_token'));
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;

        if (+response.gMode === 1 || +response.gMode === 2 || +response.gMode === 3) {
            ctx.beginPath();
            ctx.rect(response.obstacle0.x - response.obstacle0.width / 2, response.obstacle0.y - response.obstacle0.height / 2, response.obstacle0.width, response.obstacle0.height);
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.rect(response.obstacle1.x - response.obstacle1.width / 2, response.obstacle1.y - response.obstacle1.height / 2, response.obstacle1.width, response.obstacle1.height);
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(response.ball.x, response.ball.y, response.ball.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.fillText(response.score0, canvasWidth / 4, canvasHeight / 8);
        ctx.fillText(response.score1, 3 * canvasWidth / 4, canvasHeight / 8);
        
        viewers.value = response.viewers;
        if (+response.timeOut >= 0)
            ctx.fillText(Math.ceil(response.timeOut / 1000), canvasWidth / 2 - 7, canvasHeight / 2 - 40);
        
        if (+response.state === 1) { // === states.ONGOING from backnest
            if (new Date().getTime() - lastLatencyUpdate > 2000) {
                diff.value = new Date().getTime() - response.lastTimeStamp;
                lastLatencyUpdate = new Date().getTime();
            }
        }
    });
	intervalStop = setInterval(redrawAll, 20);

}

function redrawAll() {
    // console.log("room " + roomIndex + ", player " + isPlayer);
	if (roomIndex === -1)
		return ;
	if (!isPlayer) {
		if (watcherTimeStamp !== -1 && new Date().getTime() - watcherTimeStamp > 2000) {
			emit('closeCanvas');
		}
		return ;
	}
    if (key === key_up || key === key_w) {
        if (player1Login.value === "Player2" || player1Login.value === "") {
            socket.emit("updateBothPaddles", {dir: -1 * sensi, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
        } else {
            socket.emit("updatePaddle", {dir: -1 * sensi, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
        }
    } else if (key === key_down || key === key_s) {
        if (player1Login.value === "Player2" || player1Login.value === "") {
            socket.emit("updateBothPaddles", {dir: 1 * sensi, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
        } else {
            socket.emit("updatePaddle", {dir: 1 * sensi, roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
        }
    }
    socket.emit('display', roomIndex);
}

let leaveRoom = (async () => {
    emit('closeCanvas');
});

onMounted(async () => {
    await store.setStatus("ingame");
    window.addEventListener('resize', handleResize);
    // socket.connect(); //we don't connect and disconnect here
    if (props.playGame === GameType.PLAYER) {    //if he joins a game to play this function launches the game, to watch this function is not called
        socket.emit('joinGame', {mode: localStorage.getItem('game_mode'), token: localStorage.getItem('jwt_token')});
    }
    getSensi();
    init();
})

onUnmounted(async () => {
    clearInterval(intervalStop);
    window.removeEventListener('resize', handleResize);
    removeEventListener('keydown', keyDown);
    removeEventListener('keyup', keyUp);
	socket.emit('leaveRoom', {roomIndex: roomIndex, token: localStorage.getItem('jwt_token')});
    await store.setStatus("online");
    socket.off('joinGame');
    socket.off('display');
    socket.off('receiveViewerMessage');
})
</script>

<template>
    <img id="backgroundImage1" src="/assets/GameBackGrounds/Tennis1.jpg" hidden>
	<img id="backgroundImage2" src="/assets/GameBackGrounds/Tennis2.jpg" hidden>
	<img id="backgroundImage3" src="/assets/GameBackGrounds/FootBallField.jpg" hidden>
    <img id="backgroundImage4" :src=store.getImg hidden>
    <div class="row" style="max-width: 100vw;">
		<div class="col-2"  style="display:grid; place-items: center;">
            <template v-if="player0Connected">
                <GamePlayerCard :login42="player0Login"> </GamePlayerCard>
            </template>
		</div>
        <div class="col-8" style="max-height: 90vh; max-width: 90vw;">
            <div class="text-center m-4">
                <button type="button" class="btn btn-danger" @click="leaveRoom">Leave room</button>
            </div>
            <div id="canvas-container">
                <canvas id="gameCanvas"></canvas>
                <div class="row">
                    <div class="col-6">
                        <p class="p-0 m-0" style="text-align: right;"> Latency: {{ Math.abs(diff) }}ms</p> <!-- Refresh less or ceil value, only display spikes im ms-->
                    </div>
                    <div class="col-6">
                        <p class="p-0 m-0" style="text-align: left;"> Viewers: {{ viewers }}</p> <!-- Refresh less or ceil value, only display spikes im ms-->
                    </div>

                </div>
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
            <template v-if="displayChat">
                <div v-if="windowWidth > 1400" class="row" :key="refreshMsg">
                    <div>
                        <div class="card text-white bg-dark overflow-auto shadow-lg" style="min-width: 15vw; max-width: 15vw; max-height: 80vh;">
                            <div class="card-body">

                                <div class="row card-title">
                                    <svg class="col-3 blinking" height="50" width="50">
                                        <circle cx="25" cy="25" r="5" fill="red" />
                                        Sorry, your browser does not support inline SVG.  
                                    </svg>
                                    <h5 class="col-6" style="text-align: center;" @click.prevent="hideChat">Live messages</h5>
                                    <svg class="col-3 blinking" height="50" width="50">
                                        <circle cx="25" cy="25" r="5" fill="red" />
                                        Sorry, your browser does not support inline SVG.  
                                    </svg>
                                </div>
                                <template v-for="n in 10-viewerMessages.length">
                                    <br>
                                </template>
                                <template v-for="(message, index) in viewerMessages">
                                    <div class="my-1"> {{ message }} </div>
                                </template>
                
                            </div>
                                <input id="MessageBox" :maxlength="60" v-model="newMessage" @keydown.enter="sendViewerMessage" placeholder="send message">
                        </div>
                    </div>
                </div>
            </template>
        </div>
	</div>
</template>

<style lang="scss" scoped>
#canvas-container {
   width: 100%;
   text-align:center;
}
#gameCanvas {
    display: inline;
    width: 80%;
	height: 80%;
}

.blinking {
  -webkit-animation: 1s blink ease infinite;
  -moz-animation: 1s blink ease infinite;
  -ms-animation: 1s blink ease infinite;
  -o-animation: 1s blink ease infinite;
  animation: 1s blink ease infinite;
  
}

@keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-moz-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-webkit-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-ms-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-o-keyframes blink{
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

</style>