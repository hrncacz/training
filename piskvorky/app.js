let containers = {
  gameContainer: undefined,
  menuContainer: undefined,
  afterGameContainer: undefined,
};

let initState = {
  form: undefined,
  nameDivs: { divPlayer1: undefined, divPlayer2: undefined },
  players: {
    player1: {
      name: '',
      mark: '<i class="fas fa-times"></i>',
    },
    player2: {
      name: '',
      mark: '<i class="far fa-circle"></i>',
    },
  },
  size: undefined,
  coords: new Map(),
  activePlayer: undefined,
  target: 3,
  count: new Set(),
  winner: undefined,
};

let state = new Object(initState);

let fieldAbortController = new AbortController();

function resetState() {
  state = new Object(initState);
}

function resetGameContainer() {
  document.querySelectorAll('.field').forEach((field) => {
    containers.gameContainer.removeChild(field);
  });
}

function resetAbort() {
  fieldAbortController = new AbortController();
}

function hideShowGame() {
  const isHidden = containers.gameContainer.classList.contains('hide');
  return isHidden
    ? containers.gameContainer.classList.remove('hide')
    : containers.gameContainer.classList.add('hide');
}

function hideShowMenu() {
  const isHidden = containers.menuContainer.classList.contains('hide');
  return isHidden
    ? containers.menuContainer.classList.remove('hide')
    : containers.menuContainer.classList.add('hide');
}

function toggleVisible() {
  hideShowGame();
  hideShowMenu();
  return;
}

function togglePlayer() {
  return state.activePlayer === state.players.player1
    ? (state.activePlayer = state.players.player2)
    : (state.activePlayer = state.players.player1);
}

function setSize(size) {
  state.size = size;
  return;
}

function setCoords() {
  for (let x = 1; x <= state.size; x++) {
    for (let y = 1; y <= state.size; y++) {
      state.coords.set(`${x}-${y}`, '');
    }
  }
  return;
}

function setPlayers(player1, player2) {
  player1.length > 0
    ? (state.players.player1.name = player1)
    : (state.players.player1.name = 'Player 1');
  document
    .getElementById('player1')
    .querySelector('.player-plate').textContent = state.players.player1.name;
  player2.length > 0
    ? (state.players.player2.name = player2)
    : (state.players.player2.name = 'Player 2');
  document
    .getElementById('player2')
    .querySelector('.player-plate').textContent = state.players.player2.name;
  togglePlayer();
  return;
}

function getCoordinate(coord) {
  const coordinates = coord.split('-');
  coordinates.forEach((item, index) => {
    coordinates[index] = parseInt(item);
  });
  return coordinates;
}

function loadFormData() {
  const data = new FormData(state.form);
  const dataMap = new Map();
  for (const entry of data) {
    dataMap.set(entry[0], entry[1]);
  }
  setPlayers(dataMap.get('player1'), dataMap.get('player2'));
  setSize(dataMap.get('size'));
  initGame();
  return;
}

function renderGameField() {
  let gridField = '';
  for (let i = 1; i <= state.size; i++) {
    gridField += '1fr ';
  }
  containers.gameContainer.style.gridTemplateColumns = gridField;
  containers.gameContainer.style.gridTemplateRows = gridField;
  state.coords.forEach((value, coordinate) => {
    let fieldDiv = document.createElement('div');
    fieldDiv.id = `${coordinate}`;
    fieldDiv.classList.add('field');
    containers.gameContainer.appendChild(fieldDiv);
    fieldDiv.addEventListener(
      'click',
      (e) => {
        game(e.target.id);
      },
      { once: true, signal: fieldAbortController.signal }
    );
  });
}

function game(id) {
  document.getElementById(id).innerHTML = state.activePlayer.mark;
  state.coords.set(id, state.activePlayer.name);
  checkWinner();
  togglePlayer();
  return;
}

function checkWinner() {
  const checkerArr = [
    checkHorizontal,
    checkVertical,
    checkDiagLeToRi,
    checkDiagRiToLe,
  ];
  checkerArr.forEach((item) => {
    if (item()) {
      console.log('WINNER');
      fieldAbortController.abort();
      markWinningFields();
      containers.afterGameContainer.classList.remove('hide');
      setTimeout(() => {
        resetState();
        resetAbort();
        resetGameContainer();
        containers.afterGameContainer.classList.add('hide');
        loadFormData();
        console.log('BOBR');
      }, 5000);
      return;
    }
  });
}

function checkHorizontal() {
  for (let x = 1; x <= state.size; x++) {
    for (let y = 1; y <= state.size; y++) {
      if (state.coords.get(`${x}-${y}`) === state.activePlayer.name) {
        state.count.add(`${x}-${y}`);
        if (state.count.size === state.target) {
          console.log(`Zvítězil hráč ${state.activePlayer.name} na ose X`);
          return true;
        }
      } else {
        state.count.clear();
      }
    }
    state.count.clear();
  }
}

function checkVertical() {
  for (let y = 1; y <= state.size; y++) {
    for (let x = 1; x <= state.size; x++) {
      if (state.coords.get(`${x}-${y}`) === state.activePlayer.name) {
        state.count.add(`${x}-${y}`);
        if (state.count.size === state.target) {
          console.log(`Zvítězil hráč  ${state.activePlayer.name} na ose Y`);
          return true;
        }
      } else {
        state.count.clear();
      }
    }
    state.count.clear();
  }
}

function checkDiagLeToRi() {
  for (let x = 1; x + (state.target - 1) <= state.size; x++) {
    let innerX = x;
    for (let y = 0; y < state.size; y++) {
      for (
        let innerY = 1 + y;
        innerY <= state.size && innerX <= state.size;
        innerY++
      ) {
        if (
          state.coords.get(`${innerX}-${innerY}`) === state.activePlayer.name
        ) {
          state.count.add(`${innerX}-${innerY}`);
          if (state.count.size === state.target) {
            console.log(
              `Zvítězil hráč ${state.activePlayer.name} diagonálně Le to Ri`
            );
            return true;
          }
        } else {
          state.count.clear();
        }
        innerX++;
      }
      innerX = x;
    }
    state.count.clear();
  }
}

function checkDiagRiToLe() {
  for (let x = 1; x + (state.target - 1) <= state.size; x++) {
    let innerX = x;
    for (let y = 0; y < state.size; y++) {
      for (
        let innerY = state.size - y;
        innerY >= 0 && innerX <= state.size;
        innerY--
      ) {
        console.log(`${innerX}-${innerY}`);
        if (
          state.coords.get(`${innerX}-${innerY}`) === state.activePlayer.name
        ) {
          state.count.add(`${innerX}-${innerY}`);
          if (state.count.size === state.target) {
            console.log(
              `Zvítězil hráč ${state.activePlayer.name} diagonálně Le to Ri`
            );
            return true;
          }
        } else {
          state.count.clear();
        }
        innerX++;
      }
      innerX = x;
      state.count.clear();
    }
  }
}

function markWinningFields() {
  state.count.forEach((field) => {
    document.getElementById(field).classList.add('win');
  });
}

function initGame() {
  setCoords();
  renderGameField();
}

function init() {
  containers.gameContainer = document.getElementById('game');
  containers.menuContainer = document.getElementById('menu');
  containers.afterGameContainer = document.getElementById('after-game');
  containers.gameContainer.classList.add('hide');
  state.form = document.getElementById('form');
  state.form.addEventListener('onChange', (e) => {
    console.log('Změna');
    e.preventDefault();
  });
  state.form.addEventListener('submit', (e) => {
    e.preventDefault();
    loadFormData();
    toggleVisible();
  });
  // loadFormData();
  // const hideButton = document.getElementById('schovej');
  // hideButton.addEventListener('click', toggleVisible);
}

window.document.addEventListener('DOMContentLoaded', init());
