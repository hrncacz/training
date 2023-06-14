let secondDeg = 0;
let secondRounds = 0;
let minuteDeg = 0;
let hourDeg = 0;
let rucickaH;
let rucickaM;
let rucickaS;

function tik() {
  getTime();
  rucickaH.style.transform = `rotate(${hourDeg}deg)`;
  rucickaM.style.transform = `rotate(${minuteDeg}deg)`;
  rucickaS.style.transform = `rotate(${secondDeg}deg)`;
  // setTimeout(async () => {
  //   tik()
  // }, 1000);
}

function getTime() {
  if (new Date().getSeconds() === 0) {
    secondRounds += 360;
  }
  secondDeg = new Date().getSeconds() * 6 + secondRounds;
  minuteDeg = new Date().getMinutes() * 6 + (new Date().getSeconds() / 60) * 6;
  hourDeg = new Date().getHours();
  hourDeg >= 12
    ? (hourDeg = (hourDeg - 12) * 30) + (new Date().getMinutes() / 60) * 30
    : (hourDeg = hourDeg * 30);
  return;
}

async function init() {
  rucickaH = document.getElementById('rucicka-h');
  rucickaM = document.getElementById('rucicka-m');
  rucickaS = document.getElementById('rucicka-s');
  setInterval(() => {
    tik();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', init);
