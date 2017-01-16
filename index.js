var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var pi =  Math.PI;
var gameOver = false;
var rightPressed = false;
var leftPressed = false;

function Ball() {
    this.radius = 10;
    this.x = canvas.width/2;
    this.y = canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
}
Ball.prototype.draw = function() {
    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, pi*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();

    ctx.closePath();
}

function Paddle() {
    this.width = 75.0;
    this.height = 10;
    this.x = (canvas.width - this.width)/ 2;
    this.y = canvas.height - this.height;
}
Paddle.prototype.draw = function() {
    ctx.beginPath();

    ctx.rect( this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();

    ctx.closePath();
}

function Brick(x, y) {
    this.x = x;
    this.y = y;
}

function Wall() {
    this.brickRowCount = 3;
    this.brickColumnCount = 5;
    this.bricks = [];

    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;

    // Initialize the wall given the wall parameters
    for(c = 0; c < this.brickColumnCount; c++) {
        this.bricks[c] = [];
        for(r = 0; r < this.brickRowCount; r++) {
            var brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
            var brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;

            this.bricks[c].push(new Brick(brickX, brickY));
        }
    }
}
Wall.prototype.draw = function() {
    for(c = 0; c < this.brickColumnCount; c++) {
        for(r = 0; r < this.brickRowCount; r++) {
            var brick = this.bricks[c][r];

            ctx.beginPath();
            ctx.rect(brick.x, brick.y, this.brickWidth, this.brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawMessage() {
    var message = gameOver ? "GAME OVER" : "YOU WIN!";
    ctx.font = "32px sans-serif";
    ctx.fillText(message, (canvas.width - ctx.measureText(message).width) / 2, canvas.height / 2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball movement logic
    if( ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if( ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if( ball.y + ball.dy > canvas.height - ball.radius ) {
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width ) {
            ball.dy = -ball.dy;
        }
        else {
            gameOver = true;
        }
    }

    // Paddle movement logic
    if(rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 7;
    } else if(leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }

    ball.draw();
    paddle.draw();
    wall.draw();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(!gameOver) {
        requestAnimationFrame(draw);
    }
    else {
        drawMessage();
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var ball = new Ball();
var paddle = new Paddle();
var wall = new Wall();
draw();