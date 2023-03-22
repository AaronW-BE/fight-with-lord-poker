import {nanoid} from "nanoid";

export class Card {
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