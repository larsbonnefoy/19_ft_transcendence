const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 3,
  dy: -3,
};

const paddle = {
  width: 10,
  height: 100,
  x: 0,
  y: (canvas.height - 100) / 2,
};

function drawBall() {
    if (ctx != null) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    if (ctx != null) {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

function gameLoop() {
    if (ctx != null ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawBall();
    drawPaddle();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.dy < ball.radius || ball.y + ball.dy > canvas.height - ball.radius) {
        ball.dy = -ball.dy;
    }

    if (ball.x + ball.dx < ball.radius + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.dx > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && paddle.y > 0) {
        paddle.y -= 10;
    } else if (event.key === 'ArrowDown' && paddle.y < canvas.height - paddle.height) {
        paddle.y += 10;
    }
});

gameLoop();
