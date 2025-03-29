// Helper function to sort cards by value
const sortCards = (cards) => {
    return [...cards].sort((a, b) => b.number - a.number);
};

// Check for Royal Flush
const isRoyalFlush = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 5) return false;
    
    const suit = sortedCards[0].suit;
    const royalValues = [14, 13, 12, 11, 10]; // A, K, Q, J, 10
    
    const sameSuitCards = sortedCards.filter(card => card.suit === suit);
    if (sameSuitCards.length < 5) return false;
    
    const values = sameSuitCards.map(card => card.number);
    return royalValues.every(value => values.includes(value));
};

// Check for Straight Flush
const isStraightFlush = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 5) return false;
    
    const suit = sortedCards[0].suit;
    const sameSuitCards = sortedCards.filter(card => card.suit === suit);
    if (sameSuitCards.length < 5) return false;
    
    const values = sameSuitCards.map(card => card.number);
    for (let i = 0; i <= values.length - 5; i++) {
        if (values[i] - values[i + 4] === 4) return true;
    }
    return false;
};

// Check for Four of a Kind
const isFourOfAKind = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 4) return false;
    
    const values = sortedCards.map(card => card.number);
    for (let i = 0; i <= values.length - 4; i++) {
        if (values[i] === values[i + 3]) return true;
    }
    return false;
};

// Check for Full House
const isFullHouse = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 5) return false;
    
    const values = sortedCards.map(card => card.number);
    let hasThree = false;
    let hasPair = false;
    
    for (let i = 0; i <= values.length - 3; i++) {
        if (values[i] === values[i + 2]) {
            hasThree = true;
            values.splice(i, 3);
            break;
        }
    }
    
    for (let i = 0; i <= values.length - 1; i++) {
        if (values[i] === values[i + 1] && 
            (i === 0 || values[i] !== values[i - 1])) {
            hasPair = true;
            break;
        }
    }
    
    return hasThree && hasPair;
};

// Check for Flush
const isFlush = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 5) return false;
    
    const suit = sortedCards[0].suit;
    const sameSuitCards = sortedCards.filter(card => card.suit === suit);
    return sameSuitCards.length >= 5;
};

// Check for Straight
const isStraight = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 5) return false;
    
    const values = [...new Set(sortedCards.map(card => card.number))];
    for (let i = 0; i <= values.length - 5; i++) {
        if (values[i] - values[i + 4] === 4) return true;
    }
    return false;
};

// Check for Three of a Kind
const isThreeOfAKind = (cards) => {
    const sortedCards = sortCards(cards);
    if (sortedCards.length < 3) return false;
    
    const values = sortedCards.map(card => card.number);
    for (let i = 0; i <= values.length - 3; i++) {
        if (values[i] === values[i + 2]) return true;
    }
    return false;
};

// Check for Two Pair
const isTwoPair = (cards) => {
    const sortedCards = sortCards(cards).reverse();
    if (sortedCards.length < 4) return false;
    
    const values = sortedCards.map(card => card.number);
    let pairs = 0;
    
    for (let i = 0; i <= values.length - 2; i++) {
        if (values[i] === values[i + 1] && 
            (i === 0 || values[i] !== values[i - 1])) {
            pairs++;
        }
    }
    
    return pairs >= 2;
};

// Check for Pair
const isPair = (cards) => {
    const sortedCards = sortCards(cards).reverse();
    if (sortedCards.length < 2) return false;
    
    const values = sortedCards.map(card => card.number);
    for (let i = 0; i <= values.length - 2; i++) {
        if (values[i] === values[i + 1]) return true;
    }
    return false;
};

// Get High Card
const getHighCard = (cards) => {
    const sortedCards = sortCards(cards);
    return sortedCards[0];
};

// Main function to evaluate hand
const evaluateHand = (cards) => {
    try {
         // Helper function to get cards involved in combination
    const getCardsInvolved = (cards, condition, numCards) => {
        const allCombinations = [];
        for (let i = 0; i < cards.length; i++) {
            for (let j = i + 1; j < cards.length; j++) {
                if (numCards === 2) {
                    const combination = [cards[i], cards[j]];
                    if (condition(combination)) {
                        allCombinations.push(combination);
                    }
                } else {
                    for (let k = j + 1; k < cards.length; k++) {
                        if (numCards === 3) {
                            const combination = [cards[i], cards[j], cards[k]];
                            if (condition(combination)) {
                                allCombinations.push(combination);
                            }
                        } else {
                            for (let l = k + 1; l < cards.length; l++) {
                                if (numCards === 4) {
                                    const combination = [cards[i], cards[j], cards[k], cards[l]];
                                    if (condition(combination)) {
                                        allCombinations.push(combination);
                                    }
                                } else {
                                    for (let m = l + 1; m < cards.length; m++) {
                                        const combination = [cards[i], cards[j], cards[k], cards[l], cards[m]];
                                        if (condition(combination)) {
                                            allCombinations.push(combination);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return allCombinations[0] || [];
    };

    // Helper function to calculate sum of card numbers
    const calculateSum = (cards) => {
        return cards.reduce((sum, card) => sum + card.number, 0);
    };

    // Check each hand type and return best combination
    if (isRoyalFlush(cards)) {
        const involvedCards = getCardsInvolved(cards, isRoyalFlush, 5);
        return { type: "Royal Flush", cards: involvedCards, sum: calculateSum(involvedCards)+900 };
    }
    if (isStraightFlush(cards)) {
        const involvedCards = getCardsInvolved(cards, isStraightFlush, 5);
        return { type: "Straight Flush", cards: involvedCards, sum: calculateSum(involvedCards)+800 };
    }
    if (isFourOfAKind(cards)) {
        const involvedCards = getCardsInvolved(cards, isFourOfAKind, 4);
        return { type: "Four of a Kind", cards: involvedCards, sum: calculateSum(involvedCards)+700 };
    }
    if (isFullHouse(cards)) {
        const involvedCards = getCardsInvolved(cards, isFullHouse, 5);
        return { type: "Full House", cards: involvedCards, sum: calculateSum(involvedCards)+600 };
    }
    if (isFlush(cards)) {
        const involvedCards = getCardsInvolved(cards, isFlush, 5);
        return { type: "Flush", cards: involvedCards, sum: calculateSum(involvedCards)+500 };
    }
    if (isStraight(cards)) {
        const involvedCards = getCardsInvolved(cards, isStraight, 5);
        return { type: "Straight", cards: involvedCards, sum: calculateSum(involvedCards)+400 };
    }
    if (isThreeOfAKind(cards)) {
        const involvedCards = getCardsInvolved(cards, isThreeOfAKind, 3);
        return { type: "Three of a Kind", cards: involvedCards, sum: calculateSum(involvedCards)+300 };
    }
    if (isTwoPair(cards)) {
        const involvedCards = getCardsInvolved(cards, isTwoPair, 4);
        return { type: "Two Pair", cards: involvedCards, sum: calculateSum(involvedCards)+200 };
    }
    if (isPair(cards)) {
        const involvedCards = getCardsInvolved(cards, isPair, 2);
        return { type: "Pair", cards: involvedCards, sum: calculateSum(involvedCards)+100 };
    }
    
    // For High Card, return the highest card
    const highCard = getHighCard(cards);
    return { type: "High Card", cards: [highCard], sum: highCard.number };
    } catch (error) {
        console.log("Error reload the game");
    }
   
};
let x=10
