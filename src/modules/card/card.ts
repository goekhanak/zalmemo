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
    turn: string;
    options: GameOptions;
    created: any;
    lastModified: string;
}

export class Game implements IGame {
    key: string;
    cards: ICard[];
    unmatchedPairs;
    firstPickId : string;
    secondPickId: string;
    created: any;
    lastModified: string;
    turn: string;
    options: GameOptions;

    constructor(cards: ICard[], unmatchedPairs: number, options : GameOptions){
        this.cards = cards;
        this.unmatchedPairs = unmatchedPairs;
        this.options = options;
        this.turn = options.participants[0].id;
        this.created = new Date().toString();
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

export class Participant{
    id: string;
    displayName: string;
    profileImageURL: string;
    score: number;
    flipCounter: number;


    constructor(id : string, displayName: string, profileImageURL: string){
        this.id = id;
        this.displayName = displayName;
        this.profileImageURL = profileImageURL;
        this.flipCounter = 0;
        this.score = 0;

    }
}

export class GameOptions{
    category: string;
    level: Level;
    gameType: GameType;

    participants: Participant[];

    constructor(category : string, level: Level, participants: Participant[], gameType: GameType){
        this.category = category;
        this.level = level;
        this.participants = participants;
        this.gameType =  gameType;
    }
}

export enum GameType{
    SINGLE,
    MULTIPLAYER
}

