import { UserService } from '../user/user.service';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gMode: number

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

export enum game_mode {
  DEFAULT,
  OBSTACLES,
  RANDOM,
  BOTH
};

function randomIntFromInterval(min : number, max : number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Game {
  public state : states = states.STARTING;
  private isFriends : boolean = false;
  public lastTimeStamp : number = new Date().getTime();
  public roomName : string = "room0";
  public gMode : game_mode = game_mode.DEFAULT;
  public viewers : number = 0;
  public player0 : string = "";
  private move0 : boolean = false;
  public player1 : string = "";
  private move1 : boolean = false;
  private startDirection : number = 1;
  public timeOut : number = -1;
  public score0 : number = 0;
  public score1 : number = 0;
  private bounce0 : number = 0;
  private bounce1 : number = 0;
  private b0time : number = new Date().getTime();
  private b1time : number = new Date().getTime();
  private o0time : number = new Date().getTime();
  private o1time : number = new Date().getTime();
  public leftPaddle = {
    x : 2 * ballRadius,
    y : canvasHeight / 2,
    width : 2 * ballRadius,
    height : 8 * ballRadius,
  };
  public rightPaddle = {
    x : canvasWidth - 2 * ballRadius,
    y : canvasHeight / 2,
    width : 2 * ballRadius,
    height : 8 * ballRadius,
  };
  public ball = {
    x : canvasWidth / 2,
    y : canvasHeight / 2,
    radius : ballRadius,
    speed : ballSpeed,
    speedx : ballSpeed,
    speedy : 0,
  };
  public obstacle0 = {
    x : canvasWidth / 2,
    y : canvasHeight / 4,
    dir : 2,
    target : {x: canvasWidth / 2, y : canvasHeight / 4, speedx: 0, speedy: 0},
    width : 3 * ballRadius,
    height : 6 * ballRadius,
  };
  public obstacle1 = {
    x : canvasWidth / 2,
    y : 3 * canvasHeight / 4,
    dir : 0,
    target : {x: canvasWidth / 2, y : 3 * canvasHeight / 4, speedx: 0, speedy: 0},
    width : 3 * ballRadius,
    height : 6 * ballRadius,
  };

  constructor () {
  }

  ballCollisionObstacle(obstacle : any) : boolean {
    return (this.ball.x > obstacle.x - obstacle.width / 2 - this.ball.radius
      && this.ball.x < obstacle.x + obstacle.width / 2 + this.ball.radius
      && this.ball.y > obstacle.y - obstacle.height / 2 - this.ball.radius
      && this.ball.y < obstacle.y + obstacle.height / 2 + this.ball.radius);
  }

  bounceObstacle(o : any) {
    if (this.ball.x > o.x + o.width / 2) {
      this.ball.speedx = this.ball.speed;
      if (this.ball.y > o.y + o.height / 2) {
        this.ball.speedy = this.ball.speed;
      } else if (this.ball.y < o.y - o.height / 2) {
        this.ball.speedy = -this.ball.speed;
      }
    } else if (this.ball.x < o.x - o.width / 2) {
      this.ball.speedx = -this.ball.speed;
      if (this.ball.y > o.y + o.height / 2) {
        this.ball.speedy = this.ball.speed;
      } else if (this.ball.y < o.y - o.height / 2) {
        this.ball.speedy = -this.ball.speed;
      }
    } else {
      this.ball.speedy = -this.ball.speedy;
    }
  }

  async updateBall(deltaTime : number, userService : UserService) : Promise<void> {
	if (this.state === states.ENDED || +this.timeOut >= 0)
		return ;
    this.ball.x += this.ball.speedx * (deltaTime / 20);
    if (this.ball.x > canvasWidth + this.ball.radius) {
        //   this.ball.x = 2 * (canvasWidth - this.ball.radius) - this.ball.x;
        //   this.ball.speedx *= -1;
		this.resetPositions();
        ++this.score0;
        if (this.state === states.ONGOING && this.score0 >= 10 && this.score0 - this.score1 > 1) {
          this.state = states.ENDED;
          return ;
        }
	} else if (this.ball.x < -this.ball.radius) {
		//   this.ball.x = 2 * this.ball.radius - this.ball.x;
        //   this.ball.speedx *= -1;
		this.resetPositions();
        ++this.score1;
        if (this.state === states.ONGOING && this.score1 >= 10 && this.score1 - this.score0 > 1) {
          this.state = states.ENDED;
          return ;
        }
    }
    this.ball.y += this.ball.speedy * (deltaTime / 20);
    if (this.ball.y > canvasHeight - this.ball.radius) {
        this.ball.y = 2 * (canvasHeight - this.ball.radius) - this.ball.y;
        this.ball.speedy *= -1;
    } else if (this.ball.y < this.ball.radius) {
        this.ball.y = 2 * this.ball.radius - this.ball.y;
        this.ball.speedy *= -1;
    }
    if (this.ballCollisionObstacle(this.leftPaddle)) {
        this.ball.speedy = (this.ball.y - this.leftPaddle.y) * (this.ball.speed - 2) / (this.leftPaddle.height / 2);
        (this.ball.x > this.leftPaddle.x) ? this.ball.speedx = this.ball.speed : this.ball.speedx = - this.ball.speed;
        if (+this.state === states.ONGOING && new Date().getTime() - this.b0time > 100) {
          this.bounce0++;
		  this.b0time = new Date().getTime();
          this.bounce1 = 0;
          if (+this.bounce0 >= 5) {
			const user = await userService.findOne(this.player0);
            if (user && !(user.achievements & 2048)) {
              userService.addAchievement(user.login42, +user.achievements + 2048, 2048);
            }
          }
        }
    } else if (this.ballCollisionObstacle(this.rightPaddle)) {
        this.ball.speedy = (this.ball.y - this.rightPaddle.y) * (this.ball.speed - 2) / (this.rightPaddle.height / 2);
        (this.ball.x > this.rightPaddle.x) ? this.ball.speedx = this.ball.speed : this.ball.speedx = - this.ball.speed;
        if (+this.state === states.ONGOING && new Date().getTime() - this.b1time > 100) {
          this.bounce1++;
          this.b1time = new Date().getTime();
          this.bounce0 = 0;
          if (+this.bounce1 >= 5) {
            const user = await userService.findOne(this.player1);
            if (user && !(user.achievements & 2048)) {
              userService.addAchievement(user.login42, +user.achievements + 2048, 2048);
            }
          }
        }
    } else if (+this.gMode === game_mode.OBSTACLES || +this.gMode === game_mode.RANDOM || +this.gMode === game_mode.BOTH) {
      if (this.ballCollisionObstacle(this.obstacle0) && new Date().getTime() - this.o0time > 100) {
        this.bounceObstacle(this.obstacle0);
        this.o0time = new Date().getTime();
      } else if (this.ballCollisionObstacle(this.obstacle1) && new Date().getTime() - this.o1time > 100) {
        this.bounceObstacle(this.obstacle1);
        this.o1time = new Date().getTime();
      }
    }
  }

  updateObstacle(o : any, deltaTime : number) : void {
    if (+this.gMode === game_mode.OBSTACLES || +this.gMode === game_mode.BOTH) {
      switch (o.dir) {
        case 0:
          o.x += 2 * (deltaTime / 20);
          if (o.x >= 3 * canvasWidth / 4)
            o.dir = 1;
          break ;
        case 1:
          o.y -= 2 * (deltaTime / 20);
          if (o.y <= canvasHeight / 4)
            o.dir = 2;
          break ;
        case 2:
          o.x -= 2 * (deltaTime / 20);
          if (o.x <= canvasWidth / 4)
            o.dir = 3;
          break ;
        case 3:
          o.y += 2 * (deltaTime / 20);
          if (o.y >= 3 * canvasHeight / 4)
            o.dir = 0;
          break ;
      }
    }
    else if (+this.gMode === game_mode.RANDOM) {
      if (o.x >= o.target.x - 10 && o.x <= o.target.x + 10 && o.y >= o.target.y - 10 && o.y <= o.target.y + 10) {
        o.target.x = randomIntFromInterval(canvasWidth / 4, 3 * canvasWidth / 4);
        o.target.y = randomIntFromInterval(canvasHeight / 4, 3 * canvasHeight / 4);
        o.target.speedx = (o.target.x - o.x) / 50;
        o.target.speedy = (o.target.y - o.y) / 50;
      }
      o.x += o.target.speedx * deltaTime / 20;
      o.y += o.target.speedy * deltaTime / 20;
    }
  }

  resetPositions() : void {
    this.startDirection *= -1;
    this.timeOut = 2000;
    
    this.ball.x = canvasWidth / 2;
    this.ball.y = canvasHeight / 2;
    this.ball.speedx = this.startDirection * ballSpeed;
    this.ball.speedy = 0;

    this.leftPaddle.y = canvasHeight / 2;
    this.rightPaddle.y = canvasHeight / 2;

    this.bounce0 = 0;
    this.bounce1 = 0;
  }

  launchGame() : void {
    this.resetPositions();
    this.startDirection = 1;
    this.obstacle0.x = canvasWidth / 2;
    this.obstacle0.y = canvasHeight / 4;
    this.obstacle0.dir = 2;
    this.obstacle0.target = {x: canvasWidth / 2, y : canvasHeight / 4, speedx: 0, speedy: 0};
    this.obstacle1.x = canvasWidth / 2;
    this.obstacle1.y = 3 * canvasHeight / 4;
    this.obstacle1.dir = 0;
    this.obstacle1.target = {x: canvasWidth / 2, y : 3 * canvasHeight / 4, speedx: 0, speedy: 0};
    this.move0 = false;
    this.move1 = false;
    this.viewers = 0;
    this.score0 = 0;
    this.score1 = 0;
    this.bounce0 = 0;
    this.bounce1 = 0;
    this.timeOut = 3000;
    this.lastTimeStamp = new Date().getTime();
  }

  resetGame() : void {
    this.score0 = 0;
    this.score1 = 0;
    this.bounce0 = 0;
    this.bounce1 = 0;
    this.startDirection = 1;
    this.timeOut = -1;
    this.gMode = game_mode.DEFAULT;
    this.viewers = 0;
    this.obstacle0.x = canvasWidth / 2;
    this.obstacle0.y = canvasHeight / 4;
    this.obstacle0.dir = 2;
    this.obstacle0.target = {x: canvasWidth / 2, y : canvasHeight / 4, speedx: 0, speedy: 0};
    this.obstacle1.x = canvasWidth / 2;
    this.obstacle1.y = 3 * canvasHeight / 4;
    this.obstacle1.dir = 0;
    this.obstacle1.target = {x: canvasWidth / 2, y : 3 * canvasHeight / 4, speedx: 0, speedy: 0};
    this.player0 = "";
    this.move0 = false;
    this.player1 = "";
    this.move1 = false;
    this.leftPaddle.y = canvasHeight / 2;
    this.rightPaddle.y = canvasHeight / 2;
    this.ball.x = canvasWidth / 2;
    this.ball.y = canvasHeight / 2;
    this.ball.speedx = ballSpeed;
    this.ball.speedy = 0;
    this.isFriends = false;
    this.state = states.STARTING;
  }

  updateGameArea = async (newTimeStamp : number, userService: UserService) : Promise<void> => {
    if (this.state === states.ENDED)
      return ;
    let deltaTime : number = newTimeStamp - this.lastTimeStamp;
    // console.log(deltaTime + ", new is " + newTimeStamp + ", last is " + this.lastTimeStamp);
      while (deltaTime > 20) {
        await this.updateBall(20, userService);
        this.updateObstacle(this.obstacle0, 20);
        this.updateObstacle(this.obstacle1, 20);
        deltaTime -= 20;
		if (+this.timeOut >= 0) {
		  this.timeOut -= 20;
		}
      }
      await this.updateBall(deltaTime, userService);
      this.updateObstacle(this.obstacle0, deltaTime);
      this.updateObstacle(this.obstacle1, deltaTime);
      if (+this.timeOut >= 0) {
		this.timeOut -= deltaTime;
	  }
    
      // console.log("changing timestamp from " + this.lastTimeStamp + " to " + newTimeStamp);
      this.lastTimeStamp = newTimeStamp;
    // }
  }

  updateLeftPaddle(dir : number) {
    this.leftPaddle.y += 10 * dir;
    if (this.leftPaddle.y > canvasHeight - this.leftPaddle.height / 2) {
        this.leftPaddle.y = canvasHeight - this.leftPaddle.height / 2;
    } else if (this.leftPaddle.y < this.leftPaddle.height / 2) {
        this.leftPaddle.y = this.leftPaddle.height / 2;
    }
	this.move0 = true;
  }

  updateRightPaddle(dir : number) {
    this.rightPaddle.y += 10 * dir;
    if (this.rightPaddle.y > canvasHeight - this.rightPaddle.height / 2) {
      this.rightPaddle.y = canvasHeight - this.rightPaddle.height / 2;
    } else if (this.rightPaddle.y < this.rightPaddle.height / 2) {
      this.rightPaddle.y = this.rightPaddle.height / 2;
    }
	this.move1 = true;
  }

  getMove0() : boolean {
    return this.move0;
  }

  getMove1() : boolean {
    return this.move1;
  }

  setIsFriends(value : boolean) {
    this.isFriends = value;
  }

  getIsFriends() : boolean {
    return this.isFriends;
  }
};
