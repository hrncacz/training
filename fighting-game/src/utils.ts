import { Fighter } from './classes';
import { player, enemy } from './main';

function blockColision(hitting: Fighter, gotHit: Fighter) {
  if (hitting.direction === 'right') {
    if (
      hitting.getWeaponRightSide() >= gotHit.getBodyLeftSide() &&
      hitting.getWeaponRightSide() <= gotHit.getBodyRightSide() &&
      hitting.getWeaponBottomSide() >= gotHit.getBodyTopSide() &&
      hitting.getWeaponTopSide() <= gotHit.getBodyBottomSide() &&
      hitting.isHitting
    ) {
      return true;
    } else return false;
  } else if (hitting.direction === 'left') {
    if (
      hitting.getWeaponLeftSide() >= gotHit.getBodyLeftSide() &&
      hitting.getWeaponLeftSide() <= gotHit.getBodyRightSide() &&
      hitting.getWeaponBottomSide() >= gotHit.getBodyTopSide() &&
      hitting.getWeaponTopSide() <= gotHit.getBodyBottomSide() &&
      hitting.isHitting
    ) {
      return true;
    } else return false;
  }
}

let timer = 120;
let winner: string = '';
const timerDiv = document.getElementById('timer') as HTMLElement;
const resultDiv = document.getElementById('result') as HTMLElement;
const resultTextDiv = document.getElementById('result-text') as HTMLElement;
function countdown() {
  if (timer > 0 && winner === '') {
    timer--;
    timerDiv.innerText = `${timer}`;
    setTimeout(countdown, 1000);
  }
}
function toggleResultWrapper() {
  return resultDiv.classList.contains('hidden')
    ? resultDiv.classList.remove('hidden')
    : resultDiv.classList.add('hidden');
}

function checkWinner() {
  if (
    (player.getHealth() > enemy.getHealth() && timer === 0) ||
    enemy.getHealth() === 0
  ) {
    toggleResultWrapper();
    winner = 'Player Won';
    resultTextDiv.innerText = winner;
  } else if (
    (player.getHealth() < enemy.getHealth() && timer === 0) ||
    player.getHealth() === 0
  ) {
    toggleResultWrapper();
    winner = 'Enemy Won';
    resultTextDiv.innerText = winner;
  } else if (player.getHealth() === enemy.getHealth() && timer === 0) {
    toggleResultWrapper();
    winner = 'Tie';
    resultTextDiv.innerText = winner;
  }
}

function getWinner() {
  return winner;
}

function getTimer() {
  return timer;
}

export {
  blockColision,
  countdown,
  toggleResultWrapper,
  getWinner,
  getTimer,
  checkWinner,
};
