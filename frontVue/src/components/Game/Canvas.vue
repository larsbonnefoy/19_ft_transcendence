<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../../socket';
const store = useUserStore();

/* GAME */
const canvasWidth = 800;
const canvasHeight = 600;
const ballRadius = 10;
const ballSpeed = 10; //speed should be at least > 2
const paddleWidth = 2 * ballRadius;
const paddleHeight = 8 * ballRadius;
const key_d = 68;
const key_e = 69;
const key_s = 83;
const key_w = 87;


let canvas: HTMLCanvasElement | any = null;
let ctx: any = null;
let key: number = 0;
let startDirection = 1;
let scores = {
    score0 : 0,
    score1 : 0,
    color : "white",
    display : function() {
        ctx.fillStyle = "white";
        ctx.fillText(this.score0, canvasWidth / 4, canvasHeight / 8);
        ctx.fillText(this.score1, 3 * canvasWidth / 4, canvasHeight / 8);
    }
};
let leftPaddle = {
    x : paddleWidth,
	y : canvasHeight / 2,
	width : paddleWidth,
	height : paddleHeight,
	speedy : 0,
	color : "white",
	update : function(){
        this.y += this.speedy * 10;
        if (this.y > canvas.height - this.height / 2) {
            this.y = canvas.height - this.height / 2;
        } else if (this.y < this.height / 2) {
            this.y = this.height / 2;
        }
    },
    display : function(){
        if (ctx) {
            ctx.beginPath();
            ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    },
	ballCollision : function() : boolean {
        return (myBall.x > this.x - this.width / 2 - myBall.radius
            && myBall.x < this.x + this.width / 2 + myBall.radius
            && myBall.y > this.y - this.height / 2 - myBall.radius
            && myBall.y < this.y + this.height / 2 + myBall.radius);
	}
};
let rightPaddle = {
    x : canvasWidth - paddleWidth,
	y : canvasHeight / 2,
	width : paddleWidth,
	height : paddleHeight,
	speedy : 0,
	color : "white",
	update : function(){
        this.y += this.speedy * 10;
        if (this.y > canvas.height - this.height / 2) {
            this.y = canvas.height - this.height / 2;
        } else if (this.y < this.height / 2) {
            this.y = this.height / 2;
        }
    },
    display : function(){
        if (ctx) {
            ctx.beginPath();
            ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    },
	ballCollision : function() : boolean {
        return (myBall.x > this.x - this.width / 2 - myBall.radius
            && myBall.x < this.x + this.width / 2 + myBall.radius
            && myBall.y > this.y - this.height / 2 - myBall.radius
            && myBall.y < this.y + this.height / 2 + myBall.radius);
	}
};
let myBall = {
    x : canvasWidth / 2,
	y : canvasHeight / 2,
	radius : ballRadius,
	speed: ballSpeed, 
	speedx : startDirection * ballSpeed,
	speedy : 0,
	color : "white",
	update : function(){
        this.x += this.speedx;
        if (this.x > canvas.width - this.radius) {
            //   this.x = 2 * (canvas.width - this.radius) - this.x;
            //   this.speedx *= -1;
            ++scores.score0;
            resetPositions();
        } else if (this.x < this.radius) {
            //   this.x = 2 * this.radius - this.x;
            //   this.speedx *= -1;
            ++scores.score1;
            resetPositions();
        }
        this.y += this.speedy;
        if (this.y > canvas.height - this.radius) {
            this.y = 2 * (canvas.height - this.radius) - this.y;
            this.speedy *= -1;
        } else if (this.y < this.radius) {
            this.y = 2 * this.radius - this.y;
            this.speedy *= -1;
        }
        if (leftPaddle.ballCollision()) {
            this.speedy = (this.y - leftPaddle.y) * (this.speed - 2) / (leftPaddle.height / 2);
            (this.x > leftPaddle.x) ? this.speedx = this.speed : this.speedx = - this.speed;
        } else if (rightPaddle.ballCollision()) {
            this.speedy = (this.y - rightPaddle.y) * (this.speed - 2) / (rightPaddle.height / 2);
            (this.x > rightPaddle.x) ? this.speedx = this.speed : this.speedx = - this.speed;
        }
    },
    display : function(){
        if (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
};

function init() {
    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.backgroundColor = "#FFFFFF";
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	
	setInterval(updateGameArea, 20);
	
	window.addEventListener('keydown', function (e: any) {
        key = e.keyCode;
    });
	window.addEventListener('keyup', function (e: any) {
        key = 0;
    });

    socket.on("leftPaddle", (y: any) => {
        leftPaddle.y = y;
        redrawAll();
    });
    socket.on("rightPaddle", (y: any) => {
        rightPaddle.y = y;
        redrawAll();
    });
}

function resetPositions() {
    startDirection *= -1;
    
	myBall.x = canvasWidth / 2;
	myBall.y = canvasHeight / 2;
	myBall.speedx = startDirection * ballSpeed;
	myBall.speedy = 0;
    
	socket.emit("leftPaddle", {"pos": canvasHeight / 2, "min": 0, "max": canvasHeight});
	rightPaddle.y = canvasHeight / 2;
	rightPaddle.speedy = 0;
    
	key = 0;
}

function updateGameArea() {
    clearGameArea();
	leftPaddle.speedy = 0;
	if (key == key_w) {
        socket.emit("leftPaddle", {"pos": leftPaddle.y - 10,
                                    "min": leftPaddle.height / 2,
                                    "max": canvas.height - leftPaddle.height / 2});
    }
    if (key == key_s) {
        socket.emit("leftPaddle", {"pos": leftPaddle.y + 10,
                                    "min": leftPaddle.height / 2,
                                    "max": canvas.height - leftPaddle.height / 2});
    }
	rightPaddle.speedy = 0;  
	if (key == key_e) {rightPaddle.speedy = -1; }
    if (key == key_d) {rightPaddle.speedy = 1; }
    
	leftPaddle.update();
	leftPaddle.display();
	rightPaddle.update();
	rightPaddle.display();
	myBall.update();
	myBall.display();
    
	scores.display();
}

function redrawAll() {
    clearGameArea();
    leftPaddle.display();
    rightPaddle.display();
	myBall.display();
    scores.display();
}

function clearGameArea() {
    if (ctx) {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
		// ctx.strokeStyle = "black";
		// ctx.beginPath();
		// ctx.rect(0, 0, canvas.width, canvas.height);
		// ctx.stroke();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

onMounted(async () => {
    socket.connect();
    await store.setStatus("ingame");
    init();
})

onUnmounted(async () => {
    socket.disconnect();
    await store.setStatus("online");
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