export interface ICard {

    id: string;
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
    name: string;
    shopUrl: string;
    mediumHdUrl: string;
    flipped = false;


    constructor(id: string, name: string, shopUrl: string, mediumHdUrl: string) {
        this.id = id;
        this.name = name;
        this.shopUrl = shopUrl;
        this.mediumHdUrl = mediumHdUrl;
    }
}