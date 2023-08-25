import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1: string;
  
  @Column()
  player2: string;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @Column()
  elo1: number;

  @Column()
  elo2: number;
}

const canvasWidth : number = 800;
const canvasHeight : number = 600;
const ballRadius : number = 10;
const ballSpeed : number = 10; //speed should be at least > 2

export enum states {
  STARTING,
  ONGOING,
  ENDED
};

export class Game {
  public state : states = states.STARTING;
  public lastTimeStamp : number;
  public roomName : string = "room0";
  public player0 : string = "";
  public player1 : string = "";
  public startDirection : number = 1;
  public score0 : number = 0;
  public score1 : number = 0;
  public background : string = "black";
  public leftPaddle = {
    x : 2 * ballRadius,
    y : canvasHeight / 2,
    width : 2 * ballRadius,
    height : 8 * ballRadius,
    color : "white"
  };
  public rightPaddle = {
    x : canvasWidth - 2 * ballRadius,
    y : canvasHeight / 2,
    width : 2 * ballRadius,
    height : 8 * ballRadius,
    color : "white"
  };
  public ball = {
    x : canvasWidth / 2,
    y : canvasHeight / 2,
    radius : ballRadius,
    speed : ballSpeed,
    speedx : ballSpeed,
    speedy : 0,
    color : "white"
  };

  constructor () {
  }

  ballCollisionLeftPaddle() : boolean {
      return (this.ball.x > this.leftPaddle.x - this.leftPaddle.width / 2 - this.ball.radius
      && this.ball.x < this.leftPaddle.x + this.leftPaddle.width / 2 + this.ball.radius
      && this.ball.y > this.leftPaddle.y - this.leftPaddle.height / 2 - this.ball.radius
      && this.ball.y < this.leftPaddle.y + this.leftPaddle.height / 2 + this.ball.radius);
  }

  ballCollisionRightPaddle() : boolean {
      return (this.ball.x > this.rightPaddle.x - this.rightPaddle.width / 2 - this.ball.radius
      && this.ball.x < this.rightPaddle.x + this.rightPaddle.width / 2 + this.ball.radius
      && this.ball.y > this.rightPaddle.y - this.rightPaddle.height / 2 - this.ball.radius
      && this.ball.y < this.rightPaddle.y + this.rightPaddle.height / 2 + this.ball.radius);
  }

  updateBall(deltaTime : number) : void {
    this.ball.x += this.ball.speedx * (deltaTime / 20);
    if (this.ball.x > canvasWidth - this.ball.radius) {
        //   this.ball.x = 2 * (canvasWidth - this.ball.radius) - this.ball.x;
        //   this.ball.speedx *= -1;
        ++this.score0;
        if (this.score0 >= 10) {
          this.resetGame();
        }
        this.resetPositions();
      } else if (this.ball.x < this.ball.radius) {
        //   this.ball.x = 2 * this.ball.radius - this.ball.x;
        //   this.ball.speedx *= -1;
        ++this.score1;
        if (this.score1 >= 10) {
          this.resetGame();
        }
        this.resetPositions();
    }
    this.ball.y += this.ball.speedy * (deltaTime / 20);
    if (this.ball.y > canvasHeight - this.ball.radius) {
        this.ball.y = 2 * (canvasHeight - this.ball.radius) - this.ball.y;
        this.ball.speedy *= -1;
    } else if (this.ball.y < this.ball.radius) {
        this.ball.y = 2 * this.ball.radius - this.ball.y;
        this.ball.speedy *= -1;
    }
    if (this.ballCollisionLeftPaddle()) {
        this.ball.speedy = (this.ball.y - this.leftPaddle.y) * (this.ball.speed - 2) / (this.leftPaddle.height / 2);
        (this.ball.x > this.leftPaddle.x) ? this.ball.speedx = this.ball.speed : this.ball.speedx = - this.ball.speed;
    } else if (this.ballCollisionRightPaddle()) {
        this.ball.speedy = (this.ball.y - this.rightPaddle.y) * (this.ball.speed - 2) / (this.rightPaddle.height / 2);
        (this.ball.x > this.rightPaddle.x) ? this.ball.speedx = this.ball.speed : this.ball.speedx = - this.ball.speed;
    }
  }

  resetPositions() : void {
    this.startDirection *= -1;
    
    this.ball.x = canvasWidth / 2;
    this.ball.y = canvasHeight / 2;
    this.ball.speedx = this.startDirection * ballSpeed;
    this.ball.speedy = 0;
      
    this.leftPaddle.y = canvasHeight / 2;
    this.rightPaddle.y = canvasHeight / 2;
  }

  resetGame() : void {
    this.state = states.ENDED;
  }

  updateGameArea = (newTimeStamp : number) : void => {
    if (this.state === states.ENDED)
      return ;
    let deltaTime : number = newTimeStamp - this.lastTimeStamp;
    // console.log(deltaTime + ", new is " + newTimeStamp + ", last is " + this.lastTimeStamp);
    if (deltaTime > 20) {
      this.lastTimeStamp = newTimeStamp;
      this.updateBall(deltaTime);
    }
  }

  updateLeftPaddle(dir : number) {
    this.leftPaddle.y += 10 * dir;
    if (this.leftPaddle.y > canvasHeight - this.leftPaddle.height / 2) {
        this.leftPaddle.y = canvasHeight - this.leftPaddle.height / 2;
    } else if (this.leftPaddle.y < this.leftPaddle.height / 2) {
        this.leftPaddle.y = this.leftPaddle.height / 2;
    }
  }

  updateRightPaddle(dir : number) {
    this.rightPaddle.y += 10 * dir;
    if (this.rightPaddle.y > canvasHeight - this.rightPaddle.height / 2) {
      this.rightPaddle.y = canvasHeight - this.rightPaddle.height / 2;
    } else if (this.rightPaddle.y < this.rightPaddle.height / 2) {
      this.rightPaddle.y = this.rightPaddle.height / 2;
    }
  }
};
