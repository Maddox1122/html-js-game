let ctx, canvasWidth, canvasHeight;
const fps = 60;
const interval = 1000 / fps;
canvasWidth = 800;
canvasHeight = 600;
let leaves, keyObjects, swords, swordtimer, score, lives, animationFrame;

const start = () => {
  let volgende;

  return (function gameloop(timestamp) {
    if (volgende === undefined) {
      volgende = timestamp;
    }

    const verschil = timestamp - volgende;

    if (verschil > interval) {
      volgende = timestamp - (verschil % interval);
      update();
      draw();
    }

    animationFrame = requestAnimationFrame(gameloop);
  })();
};

const init = () => {
  const canvas = document.getElementById("myCanvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  leaves = [];
  keyObjects = new Array(255);
  swords = [];
  swordtimer = 0;
  score = 0;
  lives = 5;

  caracter1 = new Sprite(50, 500, 300, 0, 80, 80, "Media/samurai.png");
  background = new Sprite(0, 0, 0, 0, 800, 400, "Media/background.jpg");

  spawnEnemys();

  for (let i = 0; i < keyObjects.length; i++) {
    keyObjects[i] = false;
  }

  for (let i = 0; i < 5; i++) {
    let sword = new Sprite(0, 0, 0, -6, 80, 80, "Media/bullet.png");
    sword.alive = false;
    swords.push(sword);
  }

  document.addEventListener("keydown", keyDownHandler, false);

  function keyDownHandler(e) {
    keyObjects[e.keyCode] = true;
  }

  document.addEventListener("keyup", keyUpHandler, false);

  function keyUpHandler(e) {
    keyObjects[e.keyCode] = false;
  }

  start();
};

const update = () => {
  caracter1.update();
  background.update();
  swordtimer++;

  for (let i = 0; i < leaves.length; i++) {
    leaves[i].update();

    if (leaves[i].y > caracter1.y) {
      leaves[i].y = 0;
      lives -= 1;

      const leavexnew = Math.random() * 750;
      leaves[i].x = leavexnew;
    }
    if (lives <= 0) {
      leaves[i].speedY = 0;
    }
  }

  if (caracter1.x > canvasWidth - 40) {
    caracter1.x = canvasWidth - 40;
  } else if (caracter1.x < 0) {
    caracter1.x = 0;
  }

  handleCharacterMovement();

  for (let i = 0; i < swords.length; i++) {
    const sword = swords[i];

    if (sword.alive) {
      sword.rotation += 5;

      handleBulletCollision(sword);

      sword.update();
    }
  }
};

const spawnEnemys = () => {
  leaves = [];

  for (let i = 0; i < 5; i++) {
    const leavex = Math.random() * 750;
    const leave = new Sprite(leavex, 0, 0, 2, 50, 50, "Media/leaf.png");
    leaves.push(leave);
  }
};

const handleCharacterMovement = () => {
  if (lives <= 0) {
    return;
  }

  if (
    (keyObjects[65] || keyObjects[37]) &&
    !(keyObjects[68] || keyObjects[39])
  ) {
    caracter1.speedX = -5;
  } else if (
    (keyObjects[68] || keyObjects[39]) &&
    !(keyObjects[65] || keyObjects[37])
  ) {
    caracter1.speedX = 5;
  } else {
    caracter1.speedX = 0;
  }

  if (keyObjects[32] && swordtimer > 10) {
    handleBulletCreation();
  }
};

const handleBulletCreation = () => {
  if (lives <= 0) {
    return;
  }

  for (i = 0; i < 5; i++) {
    if (!swords[i].alive) {
      swords[i].x = caracter1.x + 20;
      swords[i].y = caracter1.y;
      swords[i].alive = true;
      swordtimer = 0;
      break;
    }
  }
};

const handleBulletCollision = (sword) => {
  if (sword.y < 0 || sword.y > canvasHeight) {
    sword.alive = false;
  }

  for (let j = 0; j < leaves.length; j++) {
    const leave = leaves[j];

    if (isCollision(leave, sword)) {
      score += 10;
      sword.alive = false;
      leaves.splice(j, 1);

      const leavexnew = Math.random() * 750;
      const newLeaf = new Sprite(leavexnew, 0, 0, 2, 50, 50, "Media/leaf.png");
      leaves.push(newLeaf);

      if (score % 100 === 0) {
        const additionalLeaves = new Sprite(
          0,
          0,
          0,
          2,
          50,
          50,
          "Media/leaf.png"
        );
        leaves.push(additionalLeaves);
      }

      break;
    }
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#855E71";
  ctx.fillRect(0, 400, 800, 200);

  caracter1.draw();
  background.draw();

  displayScoreAndLives();

  for (let i = 0; i < leaves.length; i++) {
    leaves[i].draw();
  }

  for (let i = 0; i < swords.length; i++) {
    if (swords[i].alive) {
      swords[i].draw();
    }
  }

  if (lives <= 0) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Click to Replay", 300, 300);
    ctx.fillText("Your final score: " + score, 300, 350);

    const clickReplayHandler = () => {
      leaves = [];
      keyObjects = new Array(255);
      swords = [];
      swordtimer = 0;
      score = 0;
      lives = 5;

      for (let i = 0; i < keyObjects.length; i++) {
        keyObjects[i] = false;
      }

      for (let i = 0; i < 5; i++) {
        let sword = new Sprite(0, 0, 0, -6, 80, 80, "Media/bullet.png");
        sword.alive = false;
        swords.push(sword);
      }

      document.removeEventListener("click", clickReplayHandler);

      spawnEnemys();
      caracter1.x = 350;
    };

    document.addEventListener("click", clickReplayHandler);
    return;
  }
};

const displayScoreAndLives = () => {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Lives: " + lives, 710, 30);
};

const isCollision = (first, other) => {
  let x = Math.round(first.x);
  let y = Math.round(first.y);
  let x2 = Math.round(other.x);
  let y2 = Math.round(other.y);

  let w = first.width,
    h = first.height,
    w2 = other.width,
    h2 = other.height;

  let xMin = Math.max(x, x2);
  let yMin = Math.max(y, y2);
  let xMax = Math.min(x + w, x2 + w2);
  let yMax = Math.min(y + h, y2 + h2);

  return xMin < xMax && yMin < yMax;
};
