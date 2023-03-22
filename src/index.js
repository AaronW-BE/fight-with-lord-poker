import {nanoid} from 'nanoid';
import _ from 'lodash';

let DECK_TYPE = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'BLACK JOKER', 'RED JOKER'];
let SUITE_TYPE = [
  '♠️','♣️', '♥️', '♦️'
];

let DECK_SET_TYPES = {
  _length: (cards, target) => {
    return target.max ? [target.min, target.max].indexOf(cards.length) !== -1 : cards.length >= target.min;
  },
  // check if it's a serial pair
  _serial: (cards) => {
    let carsWeight = cards.map(c => c.weight);
    let weightSet = new Set(carsWeight);

    if (carsWeight.length !== weightSet.size) {
      console.log('card repeat');
      return false;
    }
    cards.sort((a, b) => {
      return a.weight - b.weight
    })
    return cards[cards.length - 1].weight - cards[0].weight === cards.length;
  },
  single: {
    min: 1,
    max: 1,
    validator(cards) {
      return DECK_SET_TYPES._length(cards, this)
    }
  },
  pair: {
    min: 2,
    max: 2,
    validator(cards) {
      let lenValid = DECK_SET_TYPES._length(cards, this);
      if (!lenValid) return false;
      return cards[0].equal(cards[1]);
    }
  },
  linked_pair: { // 连对
    min: 6,
    validator(cards) {
      let lenValid = DECK_SET_TYPES._length(cards, this);
      if (!lenValid) return false;

      // check any has a pair card
      for (let i = 0; i < cards.length - 1; i++) {
        let hasPair = false;
        for (let j = i + 1; j < cards.length; j++) {
          if (cards[i].equalWeight(cards[j])) {
            hasPair = true;
          }
        }
        if (!hasPair) {
          return false;
        }
      }

      // distinct
      let distinctCards = [];
      cards.map(c => {
        if (distinctCards.findIndex(dc => dc.equalWeight(c)) === -1) {
          distinctCards.push(c)
        }
      })

      console.log('distinct cards', distinctCards);

      // serial check
      return DECK_SET_TYPES._serial(distinctCards)
    },
  },
  three_with_one: {
    min: 4,
    max: 4
  },
  three_with_two: {
    min: 5,
    max: 5
  },
  flying: {
    min: 6
  },
  bomb: {
    min: 4
  },
  king_bomb: {
    min: 2
  },
  straight: {
    min: 5
  },
};

let card3_1 = new Card("3", "", 0);
let card3_2 = new Card("3", "", 0);
let card4_1 = new Card("4", "", 1);
let card4_2 = new Card("4", "", 1);

let cards = [card3_1, card3_2, card4_1, card4_2];
let isValid = DECK_SET_TYPES.linked_pair.validator(cards);
console.log('isValid', isValid);

class Card {
  constructor(name, suite, weight) {
    this.id = nanoid();
    this.name = name;
    this.suite = suite;
    this.weight = weight;
  }

  compare(card) {
    if (card.weight === this.weight) return 0;
    if (this.weight === card.weight) return 1;
    else return -1;
  }

  // for card obj detect
  equal(other) {
    return this.id === other.id;
  }

  equalWeight(other) {
    return this.weight === other.weight;
  }

  toString() {
    return this.suite + ' ' + this.name
  }
}

class Deck {

  // 牌组
  cards = [];

  constructor(cards = []) {
    this.cards = cards;
  }

  /**
   * 比较大小
   * @param deck
   * @returns {number} -1, 0, 1， 小于，等于，大于
   */
  compare(deck) {
    return 0;
  }

  getCards() {
    return this.cards;
  }
}

/**
 * 手牌
 */
class HandsDeck extends Deck {
  // 已选中出牌
  #activePlayCards = [];

  // 已打出排阻列表
  #playedDecks = [];

  constructor(cards = []) {
    super(cards);
  }

  add(card) {
    this.cards.push(card);
  }

  getPlayedCards() {
    return this.#playedDecks;
  }

  selectActiveCard(index) {
    let card = this.cards[index];
    let foundCard = this.#activePlayCards.findIndex(c => c.id === card.id);
    if (foundCard === -1) {
      this.#activePlayCards.push(card);
      return;
    }
    this.#activePlayCards.splice(foundCard, 1);
  }

  getActiveCards() {
    return this.#activePlayCards;
  }

  // 检测是否是有效的出牌组合
  #checkValid() {
    if (this.#activePlayCards.length) return true;

  }

  play() {
    if (!this.#checkValid()) {
      throw new Error("not valid card combination " + this.#activePlayCards)
    }
    console.table('play cards', this.#activePlayCards);
    this.#playedDecks.push(this.#activePlayCards)
    this.#activePlayCards = [];
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



export function App() {
  let decks = GenerateDeck();
  let shuffled = shuffle(decks)
  let lordsCards = [];
  lordsCards.push(shuffled.pop())
  lordsCards.push(shuffled.pop())
  lordsCards.push(shuffled.pop())

  let lordHiddenDeck = new Deck(lordsCards);
  console.table(lordHiddenDeck);

  const dealResult = deal(shuffled, 3);
  const playerDecks = [];
  for (let i = 0; i < dealResult.length; i++) {
    playerDecks.push(new HandsDeck(dealResult[i]));
  }

  let player0 = playerDecks[0];
  console.table(player0);


  player0.selectActiveCard(0);
  player0.selectActiveCard(1);
  player0.selectActiveCard(1);
  console.log(player0.getActiveCards());

  player0.play();

}

App();
