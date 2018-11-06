// cards for the game


let cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'            
            ];


// variables


const deck = document.querySelector('.deck');
const Total_Pairs = 8;
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let match = 0;
let clockId;

function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}           

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.cards'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function initGame() {
    var deck = document.querySelector('.deck');

    var cardHTML = shuffle(cards).map(function(card){
        return generateCard(card);
    });
    
    deck.innerHTML = cardHTML.join('');
}

initGame();

deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggledCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2 ) {
            checkMatch(clickTarget);
        }
    }
    if (toggledCards.length === 2) {
        checkMatch(clickTarget);
        addMove();
        checkScore();
    }
});


// toggling and checking for matches


function toggledCard(card) {
    card.classList.add('open');
    card.classList.add('show');
}

function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}

function checkMatch () {
    if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        match++;
        console.log(match);
        if (match === Total_Pairs) {
            gameOver();
        }
    } else {
        setTimeout(() => {
            toggledCards.forEach(function(card){
                card.classList.remove('open', 'show');
            });
            toggledCards = [];
        }, 500);
    }
}

function isClickValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 && 
        !toggledCards.includes(clickTarget));
}

function resetDeck() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}



// Modal Settings


function toggleModal() {
    const modal = document.querySelector('.modal__background');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal__time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal__moves');
    const starsStat = document.querySelector('.modal__stars');
    const stars = getStars();
    
    timeStat.innerHTML = `time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}


// clock settings


function displayTime() {
    const clock = document.querySelector('.clock');
    clock.innerHTML = time;
    
}
function startClock() {
    let clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
    
}
function stopClock() {
    clearInterval(clockId);
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}


// move settings


function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}


// star settings


function checkScore() {
    if (moves ===16 || moves === 24) {
        removeStar();
    }
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function removeStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

function resetStars() {
    stars = 0; 
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}


// functions for game over reset and relay


function resetGame() {
    match = 0;
    resetClockAndTime();
    resetMoves();
    resetStars();
    initGame();
} 

function replayGame() {
    toggleModal();
    resetGame();
    initGame();
}

function gameOver() {
    stopClock();
    writeModalStats();
    toggleModal();
}


document.querySelector('.modal__cancel').addEventListener('click', () => {
    toggleModal();
});
                    
document.querySelector('.modal__replay').addEventListener('click', replayGame);
                    
document.querySelector('.restart').addEventListener('click', resetGame);