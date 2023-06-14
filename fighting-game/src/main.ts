import { Sprite, Fighter } from './classes.ts';
import {
  blockColision,
  countdown,
  checkWinner,
  getTimer,
  getWinner,
} from './utils.ts';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = document.body.offsetWidth * 0.9;
canvas.height = document.body.offsetHeight * 0.9;

const gravity = 0.8;

const playerHealthBarDiv = document.getElementById(
  'player-health'
) as HTMLElement;
const enemyHealthBarDiv = document.getElementById(
  'enemy-health'
) as HTMLElement;

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSource: '/img/background.png',
  scale: 1,
  framesMax: 1,
  fullSize: true,
});

const shop = new Sprite({
  position: { x: canvas.width * 0.6, y: canvas.height * 0.379 },
  imageSource: '/img/shop_anim.png',
  scale: 3,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: canvas.width * 0.1, y: 100 },
  offset: { x: 215, y: 143 },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  scale: 2.8,
  framesMax: 8,
  imageSource: '/img/mh1/Idle.png',
  sprites: {
    idle: {
      imageSource: '/img/mh1/Idle.png',
      framesMax: 8,
      image: new Image(),
    },
    run: { imageSource: '/img/mh1/Run.png', framesMax: 8, image: new Image() },
    jump: {
      imageSource: '/img/mh1/Jump.png',
      framesMax: 2,
      image: new Image(),
    },
    fall: {
      imageSource: '/img/mh1/Fall.png',
      framesMax: 2,
      image: new Image(),
    },
    attack1: {
      imageSource: '/img/mh1/Attack1.png',
      framesMax: 6,
      image: new Image(),
    },
  },
  weaponBlock: { offset: { x: 170, y: 75 }, width: 150, height: 50 },
});

const enemy = new Fighter({
  position: { x: canvas.width * 0.85, y: 100 },
  offset: { x: 215, y: 160 },
  velocity: { x: 0, y: 0 },
  color: 'red',
  scale: 2.8,
  framesMax: 4,

  imageSource: '/img/mh2/Idle.png',
  sprites: {
    idle: {
      imageSource: '/img/mh2/Idle.png',
      framesMax: 4,
      image: new Image(),
    },
    run: { imageSource: '/img/mh2/Run.png', framesMax: 8, image: new Image() },
    jump: {
      imageSource: '/img/mh2/Jump.png',
      framesMax: 2,
      image: new Image(),
    },
    fall: {
      imageSource: '/img/mh2/Fall.png',
      framesMax: 2,
      image: new Image(),
    },
    attack1: {
      imageSource: '/img/mh2/Attack1.png',
      framesMax: 4,
      image: new Image(),
    },
  },
  weaponBlock: { offset: { x: -170, y: 75 }, width: 150, height: 50 },
});

countdown();

function animate() {
  if (getTimer() >= 0 && getWinner() === '') {
    window.requestAnimationFrame(animate);

    background.update();
    shop.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player horizontal movement
    player.idleSprite();
    if (
      keys.a.pressed === true &&
      player.lastKey === 'a' &&
      player.position.x >= 0
    ) {
      player.velocity.x = -7;
      player.runSprite();
    } else if (
      keys.d.pressed === true &&
      player.lastKey === 'd' &&
      player.position.x +
        (player.width - player.offset.x * 3.45) / player.framesMax <=
        canvas.width
    ) {
      player.velocity.x = 7;
      player.runSprite();
    }

    if (player.velocity.y < 0) {
      player.jumpSprite();
    }

    if (player.velocity.y > 0) {
      player.fallSprite();
    }

    // Enemy horizontal movement
    enemy.idleSprite();
    if (
      keys.ArrowLeft.pressed === true &&
      enemy.lastKey === 'ArrowLeft' &&
      enemy.position.x >= 0
    ) {
      enemy.velocity.x = -7;
      enemy.runSprite();
    } else if (
      keys.ArrowRight.pressed === true &&
      enemy.lastKey === 'ArrowRight' &&
      (enemy.position.x + enemy.width * 6.62) / enemy.framesMax <= canvas.width
    ) {
      enemy.velocity.x = 7;
      enemy.runSprite();
    }

    if (enemy.velocity.y < 0) {
      enemy.jumpSprite();
    }

    if (enemy.velocity.y > 0) {
      enemy.fallSprite();
    }

    // Player hitting
    if (blockColision(player, enemy) && player.frameCurrent === 4) {
      console.log('Player hit');
      player.successfulHit();
      enemy.gotHit(10);
      player.isHitting = false;
      enemyHealthBarDiv.style.width = `${enemy.getHealth()}%`;
    }

    if (player.isHitting && player.frameCurrent === 4) {
      player.isHitting = false;
    }

    // Enemy hitting
    if (blockColision(enemy, player) && enemy.frameCurrent === 3) {
      console.log('Enemy hit');
      enemy.successfulHit();
      player.gotHit(10);
      enemy.isHitting = false;
      playerHealthBarDiv.style.width = `${player.getHealth()}%`;
    }

    if (enemy.isHitting && enemy.frameCurrent === 4) {
      enemy.isHitting = false;
    }

    player.update();
    enemy.update();
    checkWinner();
  }
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      player.lastKey = 'a';
      keys.a.pressed = true;
      break;
    case 'd':
      player.lastKey = 'd';
      keys.d.pressed = true;
      break;
    case 'w':
      !player.inAir ? player.jump() : null;
      break;
    case ';':
      player.hit();
      break;
    case 'ArrowLeft':
      enemy.lastKey = 'ArrowLeft';
      keys.ArrowLeft.pressed = true;
      break;
    case 'ArrowRight':
      enemy.lastKey = 'ArrowRight';
      keys.ArrowRight.pressed = true;
      break;
    case 'ArrowUp':
      !enemy.inAir ? enemy.jump() : null;
      break;
    case ' ':
      enemy.hit();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
  }
});

export { canvas, ctx, gravity, player, enemy };
