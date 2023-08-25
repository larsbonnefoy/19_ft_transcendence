<script setup lang="ts">

const colors : Array<string> = ["white", "red", "green", "blue", "last"];
let ballColor : number = 0;
let rightPaddleColor : number = 0;
let leftPaddleColor : number = 0;

function changeBallColor() {
	++ballColor;
	if (colors[ballColor] === "last")
		ballColor = 0;
	localStorage.setItem('ballColor', colors[ballColor]);
}

function changeRightPaddleColor() {
	++rightPaddleColor;
	if (colors[rightPaddleColor] === "last")
		rightPaddleColor = 0;
	localStorage.setItem('rightPaddleColor', colors[rightPaddleColor]);
}

function changeLeftPaddleColor() {
	++leftPaddleColor;
	if (colors[leftPaddleColor] === "last")
		leftPaddleColor = 0;
	localStorage.setItem('leftPaddleColor', colors[leftPaddleColor]);
}
</script>

<template>
    <div> 
        <button @click="changeBallColor()">Custom ball</button>
        <button @click="changeLeftPaddleColor()">Custom left paddle</button>
        <button @click="changeRightPaddleColor()">Custom right paddle</button>
    </div>
</template>