import { IGame } from './card'
import { CardService} from './card.service'
import {ICard} from "./card";
import {Card} from "./card";
import {Game} from "./card";
import { EventEmitter } from "angular2/core"


export class GameService {

    _emitter: EventEmitter<any> = new EventEmitter();

    constructor(private ref: Firebase, private cardService: CardService) {

    }

    public getGame(): Promise<any> {
        console.log('Inside get game');

        return new Promise((resolve, reject) => {

            this.ref.once("value", (snapshot) => {
                console.log(snapshot.val());
                let unfinishedGame: IGame = this.getUnfinishedGame(snapshot.val());
                if (unfinishedGame) {
                    this.subscribeUpdates(unfinishedGame)
                    resolve(unfinishedGame);
                } else {
                    this.cardService.getCards().subscribe(
                        data => {
                            let game: IGame = this.createGame(data);
                            this.subscribeUpdates(unfinishedGame)
                            resolve(game);

                        },
                        err => {
                            this.logError(err);
                            reject(err);
                        }
                    );
                }
            }, function (err) {
                console.log("The read failed: " , err.code);
                reject(err);
            });
        });
    }

    public updateGame(game: IGame){
        this.ref.child(game.key).update(game, (error: Error) => {
            if (error) {
                console.error('ERROR @ updateGame :', error);
            }
        });
    }

    private subscribeUpdates(game : IGame){
        let gameRef : Firebase=  this.ref.child(game.key);

        console.log('Gemaref: ', gameRef);

        gameRef.on('value', this.listenUpdates.bind(this));
    }

    private listenUpdates(snapshot: FirebaseDataSnapshot): void {
        console.log('UpdatedDataKey: ', snapshot.key());
        console.log('UpdatedData: ', snapshot.val());

        this._emitter._next(snapshot.val());
        this._emitter.emit(snapshot.val());
    }

    private createGame(data): IGame {

        console.log('inside Set Cards');
        console.log(data);


        let articles: any[] = data.content;
        let cards: ICard[] = [];


        this.addCardsRandomly(articles, cards);
        this.addCardsRandomly(articles, cards);

        let game: IGame = new Game(cards, articles.length);

        console.log('Created Game');
        console.log(game);

        this.pushGame(game);

        return game;
    }

    pushGame(game: IGame) {
        let newRef=  this.ref.push(game, (error: Error) => {
            if (error) {
                console.error('ERROR @ createGame :', error);
            }
        });

        game.key = newRef.key();
    }

    private addCardsRandomly(articles: any[], cards: ICard[]) {
        articles = this.shuffle(articles);
        for (var i = 0; i < articles.length; i++) {
            let article: any = articles[i];

            let card: ICard = new Card(article.id, article.name, article.shopUrl, article.media.images[0].mediumUrl);
            cards.push(card);
        }
    };

    private shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    private logError(err) : void {
        console.error('There was an error: ' + err);
    }

    private getUnfinishedGame(games: IGame[]) : IGame{

        console.log('getUnfinishedGame');
        console.log(games);

        for (var key in games) {
            if (games.hasOwnProperty(key)) {
                console.log(key);
                console.log(games[key]);
                let game: IGame = games[key];
                if (game.unmatchedPairs > 0) {
                    game.key = key;
                    return game;
                }
            }
        }

        return undefined;
    }
}