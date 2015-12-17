import { IGame } from './card'
import { CardService} from './card.service'
import {ICard} from "./card";
import {Card} from "./card";
import {Game} from "./card";
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
import {GameOptions} from "./card";
import {LegacyHtmlParser} from "angular2/src/compiler/legacy_template";
import {Level} from "./card";


export class GameService {

    game: ReplaySubject<IGame> = new ReplaySubject(1);

    constructor(private ref: Firebase, private cardService: CardService) {

    }

    public createNewGame(gameOptions: GameOptions){
        return new Promise((resolve, reject) => {
            this.cardService.getCards(gameOptions).subscribe(
                data => {
                    let game: IGame = this.generateGame(data);
                    resolve(game);
                },
                err => {
                    this.logError(err);
                    reject(err);
                }
            );
        });
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
                    let gameOptions = new GameOptions('kids', new Level(6,'Easy'))
                    this.cardService.getCards(gameOptions).subscribe(
                        data => {
                            let game: IGame = this.generateGame(data);
                            this.subscribeUpdates(game)
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

        this.game.next(snapshot.val());
    }




    private generateGame(data): IGame {

        console.log('inside Set Cards');
        console.log(data);


        let articles: any[] = data.content;
        let cards: ICard[] = [];

        this.addCards(articles, cards);
        this.addCards(articles, cards);

        cards = this.shuffleCards(cards);

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

    private addCards(articles: any[], cards: ICard[]) {

        for (var i = 0; i < articles.length; i++) {
            let article: any = articles[i];

            let card: ICard = new Card(article.id, article.name, article.shopUrl, article.media.images[0].mediumUrl);
            cards.push(card);
        }
    };

    private shuffleCards(array: ICard[]): ICard[] {
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