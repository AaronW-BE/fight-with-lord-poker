let DECK_TYPE = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'BLACK JOKER', 'RED JOKER'];
let SUITE_TYPE = [
  '♠️','♣️', '♥️', '♦️'
];

class Card {
  constructor(name, suite, weight) {
    this.name = name;
    this.suite = suite;
    this.weight = weight;
  }

  compare(card) {
    if (card.weight === this.weight) return 0;
    if (this.weight === card.weight) return 1;
    else return -1;
  }

  toString() {
    return this.suite + ' ' + this.name
  }
}

function GenerateDeck() {
  let cards = [];
  for (let i = 0; i < DECK_TYPE.length; i++) {
    let deck = DECK_TYPE[i];
    if (deck === 'BLACK JOKER' || deck === 'RED JOKER') {
      cards.push(new Card(deck, null, i + 3));
      continue;
    }

    for (let j = 0; j < SUITE_TYPE.length; j++) {
      cards.push(new Card(deck, SUITE_TYPE[j], i));
    }
  }
  return cards;
}

function shuffle(cards) {
  for (let i = 0; i < cards.length; i++) {
    let randomIdx = Math.floor(Math.random() * cards.length);
    let temp = cards[randomIdx];
    cards[randomIdx] = cards[i];
    cards[i] = temp;
  }
  return cards;
}

function deal(cards, playerNumber) {
  let result = [];

  for (let i = 0; i < cards.length; i++)
    for (let j = 0; j < playerNumber; j++) {
      if (!result[j]) {
        result[j] = [];
      }
      if (i % 3 === j) {
        result[j].push(cards[i]);
      }
    }
  return result;
}



function App() {
  let decks = GenerateDeck();
  let shuffled = shuffle(decks)
  let lordsCards = [];
  lordsCards.push(shuffled.pop())
  lordsCards.push(shuffled.pop())
  lordsCards.push(shuffled.pop())

  console.log('lords cards');
  console.table(lordsCards)

  console.dir(deal(shuffled, 3));

}

App();
