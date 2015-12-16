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
}

export class Game implements IGame {
    key: string;
    cards: ICard[];
    unmatchedPairs;
    firstPickId : string;
    secondPickId: string;

    constructor(cards: ICard[], unmatchedPairs: number){
        this.cards = cards;
        this.unmatchedPairs = unmatchedPairs;
    }
}