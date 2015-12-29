export interface ICard {

    id: string;
    configSku: string;
    name: string,
    shopUrl: string;
    mediumHdUrl: string;
    flipped: boolean;
}

export interface ICardMedia {
    images :  ICardImage [];
}

export interface ICardImage {
    mediumHdUrl : string;
}

export class Card implements ICard {
    id: string;
    configSku: string;
    name: string;
    shopUrl: string;
    mediumHdUrl: string;
    flipped = false;
    static counter : number = 0 ;


    constructor(configSku: string, name: string, shopUrl: string, mediumHdUrl: string) {
        this.id = configSku + Card.counter++;
        this.configSku = configSku;
        this.name = name;
        this.shopUrl = shopUrl;
        this.mediumHdUrl = mediumHdUrl;
    }
}

export interface IGame{
    key: string;
    cards: ICard[];
    unmatchedPairs;
    firstPickId : string;
    secondPickId: string;
    flipCounter: number;
    participants: string[];
    turn: string;
}

export class Game implements IGame {
    key: string;
    cards: ICard[];
    unmatchedPairs;
    firstPickId : string;
    secondPickId: string;
    flipCounter: number;
    participants: string[];
    turn: string;


    constructor(cards: ICard[], unmatchedPairs: number){
        this.cards = cards;
        this.unmatchedPairs = unmatchedPairs;
        this.flipCounter = 0;
    }
}

export class Level{
    pairs: number;
    name: string;

    constructor(pairs : number, name: string){
        this.pairs = pairs;
        this.name = name;
    }
}

export class GameOptions{
    category: string;
    level: Level;

    constructor(category : string, level: Level){
        this.category = category;
        this.level = level;
    }
}

export class Participant{
    id: string;
    displayName: string;
    profileImageURL: string;

    constructor(id : string, displayName: string, profileImageURL: string){
        this.id = id;
        this.displayName = displayName;
        this.profileImageURL = profileImageURL;
    }
}