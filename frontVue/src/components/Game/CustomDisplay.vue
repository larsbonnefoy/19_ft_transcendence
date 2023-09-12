<script setup lang="ts">
import {  onMounted, onUnmounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const colors : Array<string> = ["white", "red", "green", "blue"];
const backGrounds : Array<string> = ["black", "Tennis1", "Tennis2", "FootBallField", "Avatar"];
const gameModes: Array<string> = ["Classic", "Fun", "Hard", "All"];
const sliderValue = ref(retrieveSensiFromStorage());
const activeMode = ref(retrieveModeFromStorage()); //recup valeur dans local storage if no exist set to 0;

watch(sliderValue, () => {
	const retval: number = 1 + (((sliderValue.value/100) - 0.5) * 1.8)
	// console.log("newVal" + retval)
	localStorage.setItem("paddle_sensitivity", "" + retval);
})

function selectMode(modeIndex: number) {
	activeMode.value = modeIndex;
	localStorage.setItem('game_mode', "" + modeIndex);
}

function retrieveModeFromStorage():number {
	let currentMode : string | null = localStorage.getItem('game_mode');
	switch(currentMode) {
		case ("0"):
			return 0;
		case ("1"):
			return 1;
		case ("2"):
			return 2;
		case ("3"):
			return 3;
		default:
			return 3;
	}
}


function retrieveSensiFromStorage():number {
	let valuefromStorage = localStorage.getItem('paddle_sensitivity');
	if (valuefromStorage == null) {
		return 50;
	}
	let retVal: number = Math.ceil(((((+valuefromStorage -1) / 1.8) + 0.5) * 100) * 100 / 100); 
	// console.log("converted from store" + valuefromStorage);
	return retVal
}


function changeBallColor(event: any){
	localStorage.setItem('ballColor', event.target.value);
	drawBall();
}

function changeRightPaddleColor(event: any) {
	localStorage.setItem('rightPaddleColor', event.target.value);
	drawRightPaddle();
}

function changeLeftPaddleColor(event: any) {
	localStorage.setItem('leftPaddleColor', event.target.value);
	drawLeftPaddle();
}

function changeBackGround(event: any){
	localStorage.setItem('backGround', event.target.value);
	drawBackGround();
}

function resetSettings() {
	localStorage.setItem('ballColor', "white");
	localStorage.setItem('rightPaddleColor', "white");
	localStorage.setItem('leftPaddleColor', "white");
	localStorage.setItem('backGround', "black");
	selectMode(3);
	drawBackGround();
	drawBall();
	drawLeftPaddle();
	drawRightPaddle();
	(<HTMLInputElement>document.getElementById("sel1")).value = "white";
	(<HTMLInputElement>document.getElementById("sel2")).value = "white";
	(<HTMLInputElement>document.getElementById("sel3")).value = "white";
	(<HTMLInputElement>document.getElementById("sel4")).value = "black";
	sliderValue.value = 50;
}


const canvasWidth = 500;
const canvasHeight = 375;
let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let backgroundColor : string = "black";
let paddleWidth:number = 15;
let paddleHeight:number = 90;
let intervalStop: number;

function drawBall() {
		ctx.beginPath();
        ctx.arc(canvasWidth /2, canvasHeight /2, 10, 0, 2 * Math.PI);
        let color = localStorage.getItem('ballColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
}

function drawLeftPaddle() {
        ctx.beginPath();
        ctx.rect(paddleWidth / 2, canvasHeight / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
        let color : string | null = localStorage.getItem('leftPaddleColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
}

function drawRightPaddle() {
        ctx.beginPath();
        ctx.rect(canvasWidth - 3 * paddleWidth / 2, canvasHeight / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
        let color : string | null = localStorage.getItem('rightPaddleColor');
        if (color === undefined || color === null)
            color = "white";
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
}

function drawBackGround() {
	ctx.beginPath();
	let tmpBg: string | null = localStorage.getItem('backGround');
	if (tmpBg === "black" || tmpBg === null || tmpBg === undefined) {
		ctx.beginPath();
		ctx.fillStyle = "black";
    	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.closePath();
	}
	else {
		let backGroundSelect : string = "";
		let drawBg:boolean = true;
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
				drawBg = false;
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);
				ctx.closePath();
		}
		if (drawBg){
			var img = document.getElementById(backGroundSelect);
			ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
		}
	}
	drawBall();
	drawLeftPaddle();
	drawRightPaddle();
}

function init() {	
	canvas = document.getElementById('displayCustom') as HTMLCanvasElement;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.style.backgroundColor = "#FFFFFF";
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	ctx.fillStyle = backgroundColor;

	for (let color of colors) {
		if (color === localStorage.getItem('ballColor'))
			(<HTMLInputElement>document.getElementById("sel1")).value = color;
		if (color === localStorage.getItem('leftPaddleColor'))
			(<HTMLInputElement>document.getElementById("sel2")).value = color;
		if (color === localStorage.getItem('rightPaddleColor'))
			(<HTMLInputElement>document.getElementById("sel3")).value = color;
	}
	for (let back of backGrounds) {
		if (back === localStorage.getItem('backGround'))
			(<HTMLInputElement>document.getElementById("sel4")).value = back;
	}
}

//setDefault();

onMounted(async () => {
    init();
	intervalStop = setInterval(drawBackGround, 100);
})

onUnmounted(async () => {
	clearInterval(intervalStop);
})

</script>

<template>
	<img id="backgroundImage1" src="/assets/GameBackGrounds/Tennis1.jpg" hidden>
	<img id="backgroundImage2" src="/assets/GameBackGrounds/Tennis2.jpg" hidden>
	<img id="backgroundImage3" src="/assets/GameBackGrounds/FootBallField.jpg" hidden>
	<img id="backgroundImage4" :src=store.getImg hidden>
	<div class="card text-white bg-dark overflow-auto shadow-lg my-5">
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay">Ball Color</p>
				</div>
				<div class="col-6">
					<select @change="changeBallColor($event)" class="form-control selectCenter" id="sel1" style="width: 70%;">
					<template v-for="color in colors">
						<option>{{ color }}</option>
					</template>
					</select>
				</div>
			</div>
		</div>
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay">Left Paddle Color </p>
				</div>
				<div class="col-6">
					<select  @change="changeLeftPaddleColor($event)" class="form-control selectCenter" id="sel2" style="width: 70%;">
					<template v-for="color in colors">
						<option>{{ color }}</option>
					</template>
					</select>
				</div>
			</div>
		</div>
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay">Right Paddle Color</p>
				</div>
				<div class="col-6">
					<select  @change="changeRightPaddleColor($event)" class="form-control selectCenter" id="sel3" style="width: 70%;">
					<template v-for="color in colors">
						<option>{{ color }}</option>
					</template>
					</select>
				</div>
			</div>
		</div>
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay">Field</p>
				</div>
				<div class="col-6">
					<select @change="changeBackGround($event)" class="form-control selectCenter" id="sel4" style="width: 70%;">
					<template v-for="bg in backGrounds">
						<option>{{ bg }}</option>
					</template>
					</select>
				</div>
			</div>
		</div>
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay"> Paddle Sensivity </p>
				</div>
				<div class="col-6" style="text-align: center;">
					<input v-model="sliderValue" type="range" min="0" max="100" class="slider" />
					<div>
						{{ sliderValue / 100 }}
					</div>
				</div>
			</div>
		</div>
		<div class="card-body p-0 m-3">
			<div class="row">
				<div class="col-6">
					<p class="textDisplay"> Game Mode </p>
				</div>
				<div class="col-6  justify-content-start" style="text-align: center;">
					<div class="row text-center">
						<div class="btn-group">
							<template v-for="(mode, index) in gameModes" :key="index">
									<input type="radio" class="btn-check " name="options" :id="`option${index}`" autocomplete="off" @click="selectMode(index)" :checked="index == activeMode">
									<label class="btn btn-outline-secondary customButtonWidth" :for="`option${index}`">{{ mode }}</label>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
 		<button class="btn btn-secondary m-1" @click="resetSettings()">Default settings</button>
	</div>
	<div id="canvas-container">
        <canvas id="displayCustom"></canvas>
    </div>
</template>

<style scoped>
.textDisplay {
	margin-top: 0.5em;
	text-align: center;
}

.customButtonWidth {
	width: 4em !important;
	font-size: x-small;
}


.selectCenter {
	margin: auto;
	text-align: center;
}
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