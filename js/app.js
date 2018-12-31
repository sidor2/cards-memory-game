

const t0 = performance.now();
/*
 * Create a list that holds all of your cards
 */
let control = {
  cardsArray: [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bomb',
    'fa-bicycle',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bomb',
    'fa-bicycle'
  ],
  cardsToCheck: [],
  matchedCards: [],
  counter: 0,
  gameStart: 0,
  gameEnd: 0,
  totalTime: 0,
  gamesCounter: 0
}

/** constants for html selectors */
const cardsDeck = document.querySelector('.deck');
const cards = cardsDeck.children;
const cardImages = cardsDeck.querySelectorAll('i');
const restart = document.querySelector('.restart');
const moves = document.querySelector('.moves');
const starsLine = document.querySelector('.stars');
const stars = starsLine.querySelectorAll('i');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
*/
/**Creates a new deck for a game */
const setDeck = () => {
  const shuffledCards = shuffle(control.cardsArray);
  
  for(i=0; i<cardImages.length; i++) {
    if(cardImages[i].classList[1]) {
      let imageClass = cardImages[i].classList[1];
      cardImages[i].classList.replace(imageClass, shuffledCards[i]);
    } else {
      cardImages[i].classList.add(shuffledCards[i]);
    }
  }
  openCardListener();
};

/**closes the cards if there wasnt any match */
const resetDeck = () => {
  control.counter = 0;
  control.gameStart = 0;
  counterRender();
  closeAllCards();
  emptyArray(control.matchedCards);
  setDeck();
  resetRating();
  collapseTable();
  clearTable();
};

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

const openCardListener = () => {
  cardsDeck.addEventListener('click', openCard, true);
}
/**opens a card on click */
const openCard = (e) => {
  e.preventDefault();
  let image = e.target;
  if(control.gameStart === 0) {
    gameTimerStart();
  }

  if(e.target.tagName === 'LI') {
    image.classList.add('open','show');
    if(control.cardsToCheck.length < 2 && control.cardsToCheck.indexOf(image) === -1) {
      openCardsList(image);
    }
  }
  
};
/**creates an array of open cards and check if they match */
const openCardsList = (image) => {
  control.cardsToCheck.push(image);
  if(control.cardsToCheck.length === 2) {
    counterUpdate();
    counterRender();
    cardsDeck.removeEventListener('click', openCard, true);
    checkTwoCards(control.cardsToCheck);
  }
};

const checkTwoCards = (cardsToCheck) => {
  let firstCard = cardsToCheck[0].querySelector('i').classList.value;
  let secondCard = cardsToCheck[1].querySelector('i').classList.value; 
  if( firstCard === secondCard ) {
    console.log('they match');
    keepOpen();
    openCardListener();
  } else {
    console.log('they dont match');
    setTimeout(closeCards,1000);
    openCardListener();
  }
};

const closeCards = () => {
  control.cardsToCheck.forEach((card)=> {
    card.classList.remove('open', 'show');
  });
  emptyArray(control.cardsToCheck);
};

const closeAllCards = () => {
  for(i=0; i<cards.length; i++){
    cards[i].classList.remove('open', 'show', 'match');
  }
};
/**keeps the matched cards open */
const keepOpen = () => {
  control.cardsToCheck.forEach((card)=> {
    card.classList.remove('open');
    card.classList.replace('show', 'match');
  });
  control.matchedCards.push(...control.cardsToCheck);
  emptyArray(control.cardsToCheck);
  setTimeout(runCheck,500);
};

const emptyArray = (arr) => {
  arr.length = 0;
};
/**updates the moves counter */
const counterUpdate = () => {
  control.counter += 1;
  starRating();
};
/**renders the number of moves made */
const counterRender = () => {
  control.counter=== 1 ? moves.innerText = `${control.counter} Move` : moves.innerText = `${control.counter} Moves`;
};
/**runs check if all cards are open, if yes, stops the game */
const runCheck = () => {
  if(control.matchedCards.length === 16) {
    gameTimerEnd();
    cardsDeck.removeEventListener('click', openCard, true);
    control.totalTime = gameTime(control.gameStart, control.gameEnd);
    storeList(control.counter, control.totalTime);
    renderTable();
    expandTable();
  }
};

const gameTimerStart = () => {
  control.gameStart = performance.now();
  console.log(control.gameStart);
};

const gameTimerEnd = () => {
  control.gameEnd = performance.now();
  console.log(control.gameEnd);
};

const gameTime = (start, end) => {
  console.log(end-start);
  return Math.round((end - start)/1000);
};

restart.addEventListener('click', resetDeck, true);
setDeck();

/**rating for a game based on number of moves*/
const starRating = () => {
  if(control.counter >= 16 && control.counter < 20) {
    stars[0].classList.add('hide');
  } else if( control.counter >= 20) {
    stars[1].classList.add('hide');
  }
};

/**resets the rating */
const resetRating = () => {
  for(i=0; i<stars.length; i++) {
    stars[i].classList.remove('hide');
  }
};

/**game information constructor */
class GameEntry {
  constructor(turn, moves, time, score) {
  this.id = turn,
  this.turn = `Game ${turn}`,
  this.moves = moves,
  this.time = `${time} seconds`,
  this.score = score
  }
}

/**Updates the games info array with a new game data */
const updateList = (moves, time) => {
  let parGamesArr = [];
  let gamesArray = window.localStorage.getItem('list') || [];
  gamesArray.length > 0 ? parGamesArr = JSON.parse(gamesArray) : parGamesArr = [];
  control.gamesCounter += 1;
  let score=120-time-moves;
  let newEntry = new GameEntry(control.gamesCounter, moves, time, score);
  parGamesArr.push(newEntry);
  return parGamesArr;
};

const sortList = (moves, time) => {
  let list = updateList(moves, time);
  list.sort((a,b) => {
    return b.score-a.score;
  });
  return list;
};

/**stores the games list in local storage */
const storeList = (moves, time) => {
  let list = sortList(moves, time);
  let jsonList = JSON.stringify(list);
  window.localStorage.setItem('list', jsonList);
};

/**clears the local storage */
const clearStorage = () => {
  window.localStorage.clear();
  renderTable();
};


const getGames = () => {
  let games = window.localStorage.getItem('list');
  let parGames = JSON.parse(games);
  return parGames;
};

const table = document.querySelector('#gameTable');
const renderTable = () => {
  clearTable();
  let gamesArray = getGames();
  control.gamesCounter = gamesArray.length || 0;
  for(let game of gamesArray) {
    let newRow = document.createElement('tr');
    for(let item of Object.values(game)) {
      newRow.id = Object.values(game)[0];
      if(Object.values(game).indexOf(item) !== 0) {
        let newCell = document.createElement('td');
        newCell.innerText = item;
        newRow.appendChild(newCell);
      }
    }
    table.appendChild(newRow);
  }
  lastGame(gamesArray);
  renderMsg(gamesArray);
};

const clearTable = () => {
  while(table.hasChildNodes()) {
    table.removeChild(table.firstChild);
  }
};

const tablePanel = document.querySelector('#panel');
const collapseTable = () => {
  tablePanel.classList.replace('expand', 'collapse');
};

const expandTable = () => {
  tablePanel.classList.replace('collapse', 'expand');
};

const lastGame = (game) => {
  lastId = game.length;
  document.getElementById(lastId).classList.add('highlight');
};

let msgBoard = document.getElementById('msg');

const renderMsg = (games) => {
  lastId = games.length;
  let lastScore = games.filter(findLastScore)[0].score;
  let scoreArr = [];
  for(let game of games) {
    scoreArr.push(game.score);
  }
  if(scoreArr.indexOf(lastScore) === 0) {
    return msgBoard.innerHTML = "Great job! Play Again?";
  } else if (scoreArr.indexOf(lastScore) === 1) {
    return msgBoard.innerHTML = "Almost there! Try Again!";
  } else {
    return msgBoard.innerHTML = "I know you can do better! Go for it!";
  }
};

const findLastScore = (game) => {
  if(game.id === lastId) {
    return game;
  }
};

const resetTable = document.getElementById('reset-table');
resetTable.addEventListener('click', clearStorage);

renderTable();
const t1 = performance.now();
console.log(`The entire code took ${t1-t0}`);