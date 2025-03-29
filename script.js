

class Deck {
    constructor() {
        this.cards = [...freshDeck];

    }
    createDeck() {
        return    this.shuffle(this.cards); ;
    }
    shuffle(cards) {
        
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
    dealCard() {
        return this.cards.pop();
    }
}

class Game {
    constructor() {
        this.deck = new Deck();
        this.deck.createDeck();
        this.communityCards = [];
        this.playerHand = [];
        this.computerHand = [];
        this.gameStarted = false;
        this.currentBet = 0;
        this.score = 110; // Starting with 100
        this.updateBetDisplay();
        this.updateScoreDisplay();
    }

    startNewGame() {
        if (this.score >= 10 || this.deck.cards.length<7) { // Check if player has enough money
           

            this.communityCards = [];
            this.playerHand = [];
            this.computerHand = [];
            this.gameStarted = true;
            this.score -= 10; // Decrease score by 10 when starting
            this.updateScoreDisplay();
            this.dealInitialCards();
            this.dealComputerCards();
            this.dealFlop();

            document.getElementById('cards-left').textContent=this.deck.cards.length;
        }else if(this.score<=10){
            alert('Not enough money to start a new game. Please reload the page');
        }}

    restart() {
       
        this.communityCards = [];
        this.playerHand = [];
        this.computerHand = [];
        this.gameStarted = false;
        this.currentBet = 0;
        this.updateUI();
        this.updateScoreDisplay();
        this.updateBetDisplay();
    }

    dealInitialCards() {
        // Deal two cards to player
        for (let i = 0; i < 2; i++) {
            this.playerHand.push(this.deck.dealCard());
        }
        this.updateUI();
    }

    dealComputerCards() {
        // Deal two cards to computer
        for (let i = 0; i < 2; i++) {
            this.computerHand.push(this.deck.dealCard());
        }
        this.updateUI();
    }

    dealFlop() {
        // Deal three community cards
        this.communityCards.push(this.deck.dealCard());
        this.communityCards.push(this.deck.dealCard());
        this.communityCards.push(this.deck.dealCard());
            
        this.updateUI();
    }

    dealTurn() {
     if (this.deck.cards.length > 1) {this.communityCards.push(this.deck.dealCard());
            this.updateUI();}
        else{
            game.deck= new Deck();
            game.deck.createDeck();
        }
    }

  

    updateUI() {
        // Update player's hand
        const playerHandDiv = document.querySelector('.player-hand');
        playerHandDiv.innerHTML = '';
        this.playerHand.forEach(card => {
            const cardDiv = this.createCardElement(card);
            playerHandDiv.appendChild(cardDiv);
        });

        // Update computer's hand
        const computerHandDiv = document.querySelector('.computer-hand');
        computerHandDiv.innerHTML = '';
        this.computerHand.forEach(card => {
            const cardDiv = this.createCardElement(card);
            cardDiv.classList.add('closed');
            computerHandDiv.appendChild(cardDiv);
        });

        // Update community cards
        const communityCardsDiv = document.querySelector('.community-cards');
        communityCardsDiv.innerHTML = '';
        this.communityCards.forEach(card => {
            const cardDiv = this.createCardElement(card);
            communityCardsDiv.appendChild(cardDiv);
        });
        document.getElementById('cards-left').textContent=this.deck.cards.length;

    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'pokerCard';
        cardDiv.style.backgroundImage = `url(${card.face})`;
        return cardDiv;
    }

    updateScoreDisplay() {
        document.getElementById('score-value').textContent = this.score;
    }

    updateBetDisplay() {
        document.getElementById('bet-value').textContent = this.currentBet;
    }

    increaseBet() {
        if (this.score >= 10) { // Check if player has enough money
            this.currentBet += 10;
            this.score -= 10; // Decrease score when bet increases
            this.updateBetDisplay();
            this.updateScoreDisplay();
        }
    }

    decreaseBet() {
        if (this.currentBet >= 10) {
            this.currentBet -= 10;
            this.score += 10; // Increase score when bet decreases
            this.updateBetDisplay();
            this.updateScoreDisplay();
        }
    }

    countPlayerCards(){
  
        const allCards = [...this.communityCards, ...this.playerHand];
        const result = evaluateHand(allCards);
        // Remove highlight from all cards
        document.querySelectorAll('.pokerCard').forEach(card => {
        card.classList.remove('highlighted');
        });

        // Highlight cards involved in the combination
        result.cards.forEach(card => {
            const cardElements = document.querySelectorAll('.pokerCard');
            cardElements.forEach(element => {
                if (element.style.backgroundImage.includes(card.face)) {
                    element.classList.add('highlighted');
                }
            });
        });
        return {type:result.type, sum:result.sum}
    }
    countComputerCards() {
    
        const computerCards = [...this.communityCards, ...this.computerHand];
        const result = evaluateHand(computerCards);
        // Remove highlight from all cards
        document.querySelectorAll('.pokerCard').forEach(card => {
            card.classList.remove('highlighted');
            card.classList.remove('closed');

        });
    
        // Highlight only computer's cards involved in the combination
        result.cards.forEach(card => {
            const cardElements = document.querySelectorAll('.pokerCard');
            cardElements.forEach(element => {
                if (element.style.backgroundImage.includes(card.face)) {
                    element.classList.add('highlighted');
                }
            });
        });
        
        return {type:result.type, sum:result.sum}       
        }
    countCards() {
       try {
        const computerScore=this.countComputerCards();
        const playerScore=this.countPlayerCards();

        if (playerScore.sum>computerScore.sum+100) {
            this.score +=  this.currentBet*2;
            setTimeout(() => {  
            alert(`Player: ${playerScore.type} ${playerScore.sum}\nComputer: ${computerScore.type} ${computerScore.sum} \n Player wins`);
            game.restart();
            }, 300);
        }else{
            this.score -= this.currentBet;
            setTimeout(() => {
                alert(`Player: ${playerScore.type} ${playerScore.sum}\nComputer: ${computerScore.type} ${computerScore.sum+100} \n Computer wins`);
                game.restart();

            }, 300);
        
        }
        this.updateBetDisplay();
        this.updateScoreDisplay();
        this.currentBet=0;
        
       } catch (error) {
        alert('An Error');
       }
       if ( this.score>2500) {
        alert('You are a winner');
        window.location.href = 'win.html';
    }
    };
   

}



// Initialize game
const game = new Game();

// Event Listeners
const playButton=document.getElementById('play-button');
const restartButton=document.getElementById('restart-button');

playButton.addEventListener('click', () => {
    if (!game.gameStarted) {
        game.startNewGame();
        playButton.textContent='Next Round';
        restartButton.disabled=false;
    } else if (game.communityCards.length <5) {
        game.dealTurn();
        if (game.communityCards.length ==5) {
            playButton.disabled=true
        } 
    } 
});

restartButton.addEventListener('click', () => {
    game.countCards();
    playButton.textContent='Start Game';
    restartButton.disabled=true;
    playButton.disabled=false;
});

document.getElementById('increase-bet').addEventListener('click', ()=>{
    game.increaseBet();
});




document.getElementById('decrease-bet').addEventListener('click', () => {
    game.decreaseBet();
});







