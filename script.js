const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startGameEl = document.getElementById("start-game");
const startGameBtn = document.getElementById("start-game-btn");
const countdown = document.getElementById("countdown");
const difficulty = document.getElementById("difficulty");
const gameOverEl = document.getElementById("game-over");
const playAgainBtn = document.getElementById("play-again-btn");
const gameOverScore = document.getElementById("game-over-score");

let score = 0;

let gameOver = false

const brickRowCount = 9;
const brickColumnCount = 5;

//Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#009fdd";
  ctx.fill();
  ctx.closePath();
}

//Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#009fdd";
  ctx.fill();
  ctx.closePath();
}

//Draw bricks
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//Move paddle function
function movePaddle() {
  paddle.x += paddle.dx;

  //ball detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//Increase score
function increaseScore() {
  score += 1;

  if (score % (brickRowCount * brickRowCount === 0)) {
    showAllBricks();
  }
}

//Show all bricks
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}

//Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall collision right/left
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // Wall collision top/bottom
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  //Hit bottom wall - lost
  if (ball.y + ball.size > canvas.height) {
    gameOverFunc();
  }
}

//Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
}

//Draw score
function drawScore() {
  ctx.font = "20px Ariel";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Update canvas drawing and animations
function update() {
    if(!gameOver) {
        movePaddle();
        moveBall();

        //Draw all
        draw();

        requestAnimationFrame(update);
    }
  
}

//Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

//Keyup function
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event handle
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Start game handler
startGameBtn.addEventListener("click", initGame);

// Show and close rules handler
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

function initGame() {
    if (startGameEl.style.visibility = "hidden") {
        startGameEl.style.visibility = "visible";
    }
    startGameBtn.style.display = 'none';
//   startGameBtn.disabled = "disabled";
  let countdownSec = 4;

  const handleCountdown = () => {
    countdownSec = countdownSec - 1;
    countdown.innerHTML = `${countdownSec}`;

    // console.log(countdownSec);

    if (countdownSec === 0) {
      clearInterval(initCountdown);
      countdown.innerHTML = '';
    }
  };

  const initCountdown = setInterval(handleCountdown, 1000);

  setTimeout(() => {
    startGameEl.style.visibility = "hidden";
    update();
  }, 4000);
}

const gameOverFunc = () => {
  
    gameOver = true
  gameOverEl.style.display = "flex";
  gameOverScore.innerText = `Your score was ${score}`;

  playAgainBtn.addEventListener("click", () => {
    gameOverEl.style.display = "none";
    gameOver =  false;
    initGame();
    

    score = 0;
  });
};

//  if (difficulty.value === "easy") {
//    speed = 4;
//  } else if (difficulty.value === "normal") {
//    speed = 3;
//  } else if (difficulty.value === "hard") {
//    speed = 2;
//  } else if (difficulty.value === "extreme") {
//    speed = 1;
//  }
