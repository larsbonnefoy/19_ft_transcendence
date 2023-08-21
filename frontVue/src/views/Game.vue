<script setup lang="ts">
import GameHistory from '@/components/Matches/GameHistory.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted, ref } from 'vue';
const store = useUserStore();

/* ATM ingame/online triggered when going to GAME menu */
const gameCanvas = ref(null)




/* GAME */
var myGameArea = {
  canvas : document.createElement("canvas"),
  interval : setInterval(updateGameArea, 20),
  key : 0,
  start : function() {
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.canvas.style.backgroundColor = "#009090";
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      window.addEventListener('keydown', function (e: any) {
          myGameArea.key = e.keyCode;
        });
      window.addEventListener('keyup', function (e: any) {
          myGameArea.key = 0;
        });
  },
  clear : function() {
    var ctx = this.canvas.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.stroke();
    }
  }
};

var myBall = {width: 50, height: 50, x : 0, y : 0, speedx: 5, speedy: -2,
  update : function(){
      var newx = this.x + this.speedx;
      if (newx > myGameArea.canvas.width - 10) {
          newx = myGameArea.canvas.width - (newx - myGameArea.canvas.width)
          this.speedx *= -1;
      } else if (newx < 10) {
          newx *= -1;
          this.speedx *= -1;
      }
      this.x = newx;
      var newy = this.y + this.speedy;
      if (newy > myGameArea.canvas.height - 10) {
          newy = myGameArea.canvas.height - (newy - myGameArea.canvas.height)
          this.speedy *= -1;
      } else if (newy < 10) {
          newy *= -1;
          this.speedy *= -1;
      }
      this.y = newy;
  },
  display : function(){
    var ctx = myGameArea.canvas.getContext("2d");
    if (ctx) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        for (let i=0; i < 10; i++)
            ctx.arc(this.x - 5, this.y + 5, i, 0, 2 * Math.PI);
        ctx.stroke(); 
        // ctx.fillRect(this.x, this.y, this.width, this.heiht);
    }
  }
};


function startGame() {
    myGameArea.start();
    setBall(30, 30, 10, 120);
    myBall.display();

}

function setBall(width: number, height: number, x: number, y: number) {
  myBall.width = width;
  myBall.height = height;
  myBall.x = x; 
  myBall.y = y;
}

function updateGameArea() {
  myGameArea.clear();
//   myBall.speedx = 0;
//   myBall.speedy = 0;    
//   if (myGameArea.key && myGameArea.key == 37) {myBall.speedx = -1; }
//   if (myGameArea.key && myGameArea.key == 39) {myBall.speedx = 1; }
//   if (myGameArea.key && myGameArea.key == 38) {myBall.speedy = -1; }
//   if (myGameArea.key && myGameArea.key == 40) {myBall.speedy = 1; }
  myBall.update();
  myBall.display();
}


onMounted(async () => {
    await store.setStatus("ingame");
    startGame();
})

onUnmounted(async () => {
    await store.setStatus("online");
})
</script>

<template>
    <h1> Game Page </h1>
    <!-- <canvas id="c-game-canvas" ref="gameCanvas"></canvas> -->
    <!-- <script src="game.js"></script>-->
</template>

<style>

</style>
