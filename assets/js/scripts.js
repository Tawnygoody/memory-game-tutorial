class AudioController {
    constructor() {
        this.bgMusic = new Audio("assets/audio/bgmusic.wav");
        this.flipSound = new Audio("assets/audio/cardflip.wav");
        this.matchSound = new Audio("assets/audio/match.wav");
        this.victorySound = new Audio("assets/audio/victory.wav");
        this.gameOverSound = new Audio("assets/audio/gameover.wav");
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class WorldOfRugby {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById("time-remaining");
        this.ticker = document.getElementById("flips");
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null; 
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = []; // all the matched cards go into this array
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerHTML = this.timeRemaining;
        this.ticker.innerHTML = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove("visible");
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerHTML = this.totalClicks;
            card.classList.add("visible");

            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory(); 
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerHTML = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById("game-over-text").classList.add("visible");
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById("victory-text").classList.add("visible");
    }

    shuffleCards() { //fisher-yates shuffle
        for(let i = this.cardsArray.length -1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName("overlay-text")); // Returns an HTML array
    let cards = Array.from(document.getElementsByClassName("card")); // Returns an HTML array
    let game = new WorldOfRugby(100, cards);

    overlays.forEach(overlay => { //adds a click event listenver to each overlay and removes the visible class when clicked.
        overlay.addEventListener("click", () => {
            overlay.classList.remove("visible");
            game.startGame();
            
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready()); //Once everything inside the HTML file has loaded call the ready function.
}  else { // We know everything has loaded therefore call the readyv function.
    ready();
}

let audioController = new AudioController();