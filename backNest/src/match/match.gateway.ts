import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Res } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Response } from 'express';

const canvasWidth : number = 800;
const canvasHeight : number = 600;
const ballRadius : number = 10;
const ballSpeed : number = 10; //speed should be at least > 2

let game = {
    ongoing : false,
    startDirection : 1,
    score0 : 0,
    score1 : 0,
    background : "black",
    leftPaddle : {
      x : 2 * ballRadius,
      y : canvasHeight / 2,
      width : 2 * ballRadius,
      height : 8 * ballRadius,
      color : "white",
      ballCollision : function() : boolean {
          return (game.ball.x > this.x - this.width / 2 - game.ball.radius
              && game.ball.x < this.x + this.width / 2 + game.ball.radius
              && game.ball.y > this.y - this.height / 2 - game.ball.radius
              && game.ball.y < this.y + this.height / 2 + game.ball.radius);
      }
    },
    rightPaddle : {
      x : canvasWidth - 2 * ballRadius,
      y : canvasHeight / 2,
      width : 2 * ballRadius,
      height : 8 * ballRadius,
      color : "white",
      ballCollision : function() : boolean {
        return (game.ball.x > this.x - this.width / 2 - game.ball.radius
            && game.ball.x < this.x + this.width / 2 + game.ball.radius
            && game.ball.y > this.y - this.height / 2 - game.ball.radius
            && game.ball.y < this.y + this.height / 2 + game.ball.radius);
      }
    },
    ball : {
      x : canvasWidth / 2,
      y : canvasHeight / 2,
      radius : ballRadius,
      speed : ballSpeed,
      speedx : ballSpeed,
      speedy : 0,
      color : "white",
      update : function(){
        this.x += this.speedx;
        if (this.x > canvasWidth - this.radius) {
            //   this.x = 2 * (canvasWidth - this.radius) - this.x;
            //   this.speedx *= -1;
            ++game.score0;
            resetPositions();
        } else if (this.x < this.radius) {
            //   this.x = 2 * this.radius - this.x;
            //   this.speedx *= -1;
            ++game.score1;
            resetPositions();
        }
        this.y += this.speedy;
        if (this.y > canvasHeight - this.radius) {
            this.y = 2 * (canvasHeight - this.radius) - this.y;
            this.speedy *= -1;
        } else if (this.y < this.radius) {
            this.y = 2 * this.radius - this.y;
            this.speedy *= -1;
        }
        if (game.leftPaddle.ballCollision()) {
            this.speedy = (this.y - game.leftPaddle.y) * (this.speed - 2) / (game.leftPaddle.height / 2);
            (this.x > game.leftPaddle.x) ? this.speedx = this.speed : this.speedx = - this.speed;
        } else if (game.rightPaddle.ballCollision()) {
            this.speedy = (this.y - game.rightPaddle.y) * (this.speed - 2) / (game.rightPaddle.height / 2);
            (this.x > game.rightPaddle.x) ? this.speedx = this.speed : this.speedx = - this.speed;
        }
      },
    },
}

function resetPositions() {
  game.startDirection *= -1;
  
  game.ball.x = canvasWidth / 2;
  game.ball.y = canvasHeight / 2;
  game.ball.speedx = game.startDirection * ballSpeed;
  game.ball.speedy = 0;
    
  game.leftPaddle.y = canvasHeight / 2;
  game.rightPaddle.y = canvasHeight / 2;
}

function updateGameArea() {
    game.ball.update();
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
//      allowedHeaders: ["my-custom-header"],
//      credentials: true
  },
})
export class MatchGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): any /*Observable<WsResponse<number>>*/ {
      console.log("got message: " + data);
    //return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    //res.json({"test": "salut"});
    this.server.emit("events", data);
    return data;
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
  
  @SubscribeMessage('leftPaddle')
  async computeLeftPaddle(@MessageBody() dir: number) {
      game.leftPaddle.y += 10 * dir;
      // console.log("leftPaddle: " + <number>game.leftPaddle.y);
      if (game.leftPaddle.y > canvasHeight - game.leftPaddle.height / 2) {
          game.leftPaddle.y = canvasHeight - game.leftPaddle.height / 2;
      } else if (game.leftPaddle.y < game.leftPaddle.height / 2) {
          game.leftPaddle.y = game.leftPaddle.height / 2;
      }
  }

  @SubscribeMessage('rightPaddle')
  async computeRightPaddle(@MessageBody() dir: number) {
      game.rightPaddle.y += 10 * dir;
      // console.log("rightPaddle: " + <number>game.rightPaddle.y);
      if (game.rightPaddle.y > canvasHeight - game.rightPaddle.height / 2) {
        game.rightPaddle.y = canvasHeight - game.rightPaddle.height / 2;
      } else if (game.rightPaddle.y < game.rightPaddle.height / 2) {
        game.rightPaddle.y = game.rightPaddle.height / 2;
      }
  }

  @SubscribeMessage('display')
  async display() {
    this.server.emit("display", game);
  }

  @SubscribeMessage('startGame')
  async computeGame() {
      if (!game.ongoing) {
          game.ongoing = true;
          setInterval(updateGameArea, 20);
      }
  }

}