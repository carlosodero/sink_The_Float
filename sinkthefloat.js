// access to rootElement
const mainDiv = document.getElementById('root');

// get userName
const url_string = window.location.href;
const url = new URL(url_string);
const userName = url.searchParams.get('name');

// create Boards Containers
const playerBoard = document.createElement('div');
playerBoard.id = 'playerBoard';
playerBoard.setAttribute('class', 'containerDiv');
mainDiv.appendChild(playerBoard);

const cpuBoard = document.createElement('div');
cpuBoard.id = 'cpuBoard';
cpuBoard.setAttribute('class', 'containerDiv');
mainDiv.appendChild(cpuBoard);

// create div for info
const infoDiv = document.createElement('div');
infoDiv.id = 'infoDiv';
infoDiv.innerText= `${userName}` + ', now it\'s time to place your boats!';
infoDiv.classList.add('parpadear');
mainDiv.appendChild(infoDiv);

// update infoDiv message
const updateTxt = (msg) => {
  infoDiv.innerText = msg;
};

// remove class for infoDiv message animation
const removeClassInfoDiv = () => {
  infoDiv.classList.remove('parpadear');
};

// sound for reach or sunk
const playSound = (soundID) => {
  const audio = document.getElementById(soundID);
  audio.play();
};

// arrays for Numbers & Letters
const rowNumber = ['','1','2','3','4','5','6','7','8','9','10'];
const columnLetter = ['','A','B','C','D','E','F','G','H','I','J'];

// type of symbols and IAboard
const water = '~';
const reach = '■';
const sunk = '█';

const IABoard = [
  ['1', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['2', '2', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['3', '3', '3', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['4', '4', '4', '4', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['5', '5', '5', '5', '5', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
];

// control player turn & boats are launched
let allBoatsLaunched = false;
let myTurn = true;

// Type of ships and set/live counters
let aircraftCarrier = 5;
let positionAircraftCarrier = 5;
let cpuAircraftCarrier = 5;
let vessel = 4;
let positionVessel = 4;
let cpuVessel = 4;
let submarine = 3;
let positionSubmarine = 3;
let cpuSubmarine = 3;
let cruise = 2;
let positionCruise = 2;
let cpuCruise = 2;
let boat = 1;
let positionBoat = 1;
let cpuBoat = 1;

// create Game Boards
const paintBoard = (gamerBoard) => {
  for (let rowindex = 0; rowindex < 11; rowindex++) {
    const rowBoard = document.createElement('div');
    rowBoard.id = gamerBoard + `row${rowindex}`;
    rowBoard.setAttribute('class', 'row');

    for (let columnindex = 0; columnindex < 10; columnindex++) {
      const columnBoard = document.createElement('div');
      columnBoard.id = gamerBoard + columnLetter[columnindex] + rowNumber[rowindex];
      columnBoard.setAttribute('class', 'column');
      rowBoard.appendChild(columnBoard);
      if (!rowindex && columnindex) {
        columnBoard.innerText = columnLetter[columnindex];
      }
      if (!columnindex) {
        columnBoard.innerText = rowNumber[rowindex];
      }
    }
    if (gamerBoard === 'player') {
      playerBoard.appendChild(rowBoard);
    } else {
      cpuBoard.appendChild(rowBoard);
    }
  }
};

// get Mouse Position
let selectedCell;
function mouseInfo (e) {
  selectedCell = document.getElementById(e.target.id);
  // console.log(selectedCell);
  return selectedCell;
}
document.addEventListener('click', mouseInfo);

// position Ships on myBoard
function launchPlayerShips() {
  if (selectedCell.id.startsWith('player')) {
    if (selectedCell.innerText === '' && positionBoat) {
      selectedCell.innerText = '1';
      selectedCell.classList.add('selected');
      updateTxt('Your Boat was launched');
      positionBoat--;
    } else if (!positionBoat && positionCruise) {
      selectedCell.innerText = '2';
      selectedCell.classList.add('selected');
      updateTxt('Your Cruise was launched');
      positionCruise--;
    }
    else if (!positionCruise && positionSubmarine) {
      selectedCell.innerText = '3';
      selectedCell.classList.add('selected');
      updateTxt(' Your Submarine was launched');
      positionSubmarine--;
    }
    else if (!positionSubmarine && positionVessel) {
      selectedCell.innerText = '4';
      selectedCell.classList.add('selected');
      updateTxt(' Your Vessel was launched');
      positionVessel--;
    }
    else if (!positionVessel && positionAircraftCarrier > 1) {
      selectedCell.innerText = '5';
      selectedCell.classList.add('selected');
      updateTxt(' Your Carrier was launched');
      positionAircraftCarrier--;
    } else {
      if (positionAircraftCarrier) {
        allBoatsLaunched = true;
        selectedCell.innerText = '5';
        selectedCell.classList.add('selected');
        positionAircraftCarrier--;
        updateTxt('Now Start Bombing! ' + `${userName}`);
        playSound('321Sound');
        removeClassInfoDiv();
      }
    }
  } else if (selectedCell.id.startsWith('cpu') && !allBoatsLaunched){
    updateTxt(`${userName}` + ' place your boats first!');
  }
};

// check CPU ships position
function checkCpuShips () {
  if (selectedCell.classList.value === 'column') {
    if (selectedCell.id.startsWith('cpu')) {
      let cpuRow = selectedCell.id.slice(-1);
      let cpuColum = selectedCell.id.slice(-2, -1);

      if (selectedCell.id.endsWith('0')) {
        cpuRow = selectedCell.id.slice(-2);
        cpuColum = selectedCell.id.slice(-3, -2);
      }
      const searchRowIndex = rowNumber.indexOf(cpuRow);
      const searchColumnIndex = columnLetter.indexOf(cpuColum);
      // console.log('cpuRow:', cpuRow);
      // console.log('searchRowIndex', searchRowIndex);
      // console.log('cpuColumn:', cpuColum);
      // console.log('searchColumnIndex', searchColumnIndex);

      let selectedIAPosition = IABoard[searchRowIndex - 1][searchColumnIndex - 1];

      switch (selectedIAPosition) {
        case '1':
          if (cpuBoat > 0) {
            cpuBoat--;
            selectedIAPosition = sunk;
            selectedCell.classList.add('sunk');
            updateTxt('Congrats ' + `${userName}` + '!. You sunk foe boat!');
            playSound('sunkSound');
            // console.log('boat sunk', boat);
            // console.log(selectedIAPosition);
          }
          break;
        case '2':
          if (cpuCruise > 1) {
            selectedIAPosition = reach;
            selectedCell.classList.add('reach');
            playSound('reachSound');
            cpuCruise--;
            // console.log('cruise sunk', cruise);
            // console.log(selectedIAPosition);
          } else {
            cpuCruise--;
            selectedCell.classList.add('sunk');
            updateTxt('Nice ' + `${userName}` + '!. You sunk foe cruise!');
            playSound('sunkSound');
          }
          break;
        case '3':
          if (cpuSubmarine > 1) {
            cpuSubmarine--;
            selectedIAPosition = reach;
            selectedCell.classList.add('reach');
            playSound('reachSound');
            // console.log('submarine sunk', submarine);
            // console.log(selectedIAPosition);
          } else {
            cpuSubmarine--;
            selectedCell.classList.add('sunk');
            updateTxt('Well done ' + `${userName}` + '!. You sunk foe cruise!');
            playSound('sunkSound');
          }
          break;
        case '4':
          if (cpuVessel > 1) {
            cpuVessel--;
            selectedIAPosition = reach;
            selectedCell.classList.add('reach');
            playSound('reachSound');
            // console.log('vessel sunk', vessel);
            // console.log(selectedIAPosition);
          } else {
            cpuVessel--;
            selectedCell.classList.add('sunk');
            updateTxt('Wow ' + `${userName}` + '!. You sunk foe cruise!');
            playSound('sunkSound');
          }
          break;
        case '5':
          if (cpuAircraftCarrier > 1) {
            cpuAircraftCarrier--;
            selectedIAPosition = reach;
            selectedCell.classList.add('reach');
            playSound('reachSound');
            // console.log('aircraftCarrier sunk', aircraftCarrier);
            // console.log(selectedIAPosition);
          } else {
            cpuAircraftCarrier--;
            selectedCell.classList.add('sunk');
            updateTxt('Amazing ' + `${userName}` + '!. You sunk foe cruise!');
            playSound('sunkSound');
          }
          break;
        default:
          selectedIAPosition = water;
          selectedCell.classList.add('water');
          // infoDiv.innerText = 'Water!';
          myTurn = false;
          // console.log('checkCpuShips myTurn', myTurn);
          break;
          // console.log(selectedIAPosition);
      }
    }
  }
};

function IAshoot() {
  for (let index = 1; index < 100; index++) {
    const row = Math.floor((Math.random() * 10) + 1);
    const column = Math.floor((Math.random() * 9) + 1);
    const IACellShoot = document.getElementById('player' + columnLetter[column] + rowNumber[row]);
    // console.log('IACellShoot', IACellShoot);
    // console.log(row);
    // console.log(column);

    if (IACellShoot.classList.value === 'column' || IACellShoot.classList.value === 'column selected') {
      if (IACellShoot.innerText === '1') {
        // console.log(IACellShoot.innerText);
        if (boat) {
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('sunk');
          updateTxt('Your boat was sunk!');
          playSound('ohnoSound');
          boat--;
          index--;
          continue;
        }
      } else if (IACellShoot.innerText === '2') {
        if (cruise > 1) {
          cruise--;
          index--;
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('reach');
          continue;
        } else {
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('sunk');
          updateTxt('Your cruise was sunk!');
          playSound('ohnoSound');
          cruise--;
        }
      } else if (IACellShoot.innerText === '3') {
        if (submarine > 1) {
          submarine--;
          index--;
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('reach');
          continue;
        } else {
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('sunk');
          updateTxt('Your submarine was sunk!');
          playSound('ohnoSound');
          submarine--;
        }
      } else if (IACellShoot.innerText === '4') {
        if (vessel > 1) {
          vessel--;
          index--;
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('reach');
          continue;
        } else {
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('sunk');
          updateTxt('Your vessel was sunk!');
          playSound('ohnoSound');
          vessel--;
        }
      } else if (IACellShoot.innerText === '5') {
        if (aircraftCarrier > 1) {
          aircraftCarrier--;
          index--;
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('reach');
          continue;
        } else {
          IACellShoot.classList.remove('selected');
          IACellShoot.classList.add('sunk');
          updateTxt('Your carrier was sunk!');
          playSound('ohnoSound');
          aircraftCarrier--;
        }
      } else if (IACellShoot.innerText === '') {
        IACellShoot.classList.add('water');
        // updateTxt('You are save! Bomb them again!');
        myTurn = true;
        // console.log('turnIAshoot', myTurn);
        break;
      }
    }
  }
}

function gameTurn() {
  if (myTurn) {
    document.addEventListener('click', checkCpuShips);
  }
  if (!myTurn) {
    IAshoot();
  }
}

function whoWins() {
  if (!cpuBoat && !cpuCruise && !cpuSubmarine && !cpuVessel && !cpuAircraftCarrier) {
    updateTxt('You Win ' + `${userName}` + '!');
    window.alert('You Win ' + `${userName}` + '!');
  } else if (!boat && !cruise && !submarine && !vessel && !aircraftCarrier) {
    updateTxt('You Lose ' + `${userName}` + '!');
    window.alert('You Lose ' + `${userName}` + '!');
  }
}



// init function
function init() {
  paintBoard('player');
  paintBoard('cpu');
  document.addEventListener('click', launchPlayerShips);
  document.addEventListener('click', gameTurn);
  document.addEventListener('click', whoWins);
}

init();
