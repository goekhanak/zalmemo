export interface ICard {
    id: string;
    name: string,
    shopUrl: string;
    title: string;
    media : ICardMedia ;
}

export interface ICardMedia {
    images :  ICardImage [];
}

export interface ICardImage {
    mediumHdUrl : string;
}