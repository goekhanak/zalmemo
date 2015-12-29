import { IGame } from './card'
import { CardService} from './card.service'
import {ICard} from "./card";
import {Card} from "./card";
import {Game} from "./card";
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
import {GameOptions} from "./card";
import {LegacyHtmlParser} from "angular2/src/compiler/legacy_template";
import {Level} from "./card";
import {Participant} from "./card";
import {FIREBASE_PRESENCE} from "../../config";
import {AuthService} from "../auth/auth-service";


export class GameService {

    game: ReplaySubject<IGame> = new ReplaySubject(1);
    opponentCandidates: ReplaySubject<Participant[]> = new ReplaySubject(1);
    oldGameRef : Firebase;
    participantsRef : Firebase;

    constructor(private ref: Firebase, private cardService: CardService, private authService: AuthService) {
        this.participantsRef = new Firebase(FIREBASE_PRESENCE);
    }

    public getGameOpponentCandidates() : Promise< Participant[]>{

        return new Promise((resolve, reject) => {

            this.participantsRef.once("value", (snapshot) => {
                var presences = snapshot.val();
                console.log('Participants: ', presences);
                this.subscribeParticipantUpdates();
                resolve(this.filterOpponentParticipants(presences));
            }, function (err) {
                console.log("The read failed: " , err.code);
                reject(err);
            });
        });
    }

    private filterOpponentParticipants(presences) {
        let opponentCandidates: Participant[] = [];

        for (var userId in presences) {
            if (presences.hasOwnProperty(userId)) {
                // add other users as potential candidates
                if (userId !== this.authService.userId) {
                    opponentCandidates.push(presences[userId]);
                }
            }
        }
        return opponentCandidates;
    };

    private subscribeParticipantUpdates(){
        this.participantsRef.on('value', this.listenParticipantUpdates.bind(this));
    }

    private listenParticipantUpdates(snapshot: FirebaseDataSnapshot): void {
        console.log('Updated Participant DataKey: ', snapshot.key());
        console.log('Updated Participant Data: ', snapshot.val());

        this.opponentCandidates.next(this.filterOpponentParticipants(snapshot.val()));
    }

    public createNewGame(gameOptions: GameOptions){
        return new Promise((resolve, reject) => {
            this.cardService.getCards(gameOptions).subscribe(
                data => {
                    let game: IGame = this.generateGame(data, gameOptions);
                    resolve(game);
                },
                err => {
                    this.logError(err);
                    reject(err);
                }
            );
        });
    }

    public getGame(key: string): Promise<any> {
        console.log('Inside get game with key: ' ,key);

        return new Promise((resolve, reject) => {

            this.ref.once("value", (snapshot) => {
                console.log('Games: ', snapshot.val());

                let unfinishedGame: IGame = this.findGame(snapshot.val(), key);
                if (unfinishedGame) {
                    this.subscribeGameUpdates(unfinishedGame);
                    resolve(unfinishedGame);
                }
            }, function (err) {
                console.log("The read failed: " , err.code);
                reject(err);
            });
        });
    }

    public currentUserTurn(game: IGame): boolean{
        return this.authService.id === game.turn;
    }

    public updateGame(game: IGame){
        this.ref.child(game.key).update(game, (error: Error) => {
            if (error) {
                console.error('ERROR @ updateGame :', error);
            }
        });
    }

    private subscribeGameUpdates(game : IGame){

        console.log('subscribeUpdates:', this.oldGameRef);

        if(this.oldGameRef){
            this.oldGameRef.off('value', this.listenGameUpdates.bind(this));
        }

        let gameRef : Firebase = this.ref.child(game.key);
        console.log('Gameref: ', gameRef);
        gameRef.on('value', this.listenGameUpdates.bind(this));
        this.oldGameRef = gameRef;
    }

    private listenGameUpdates(snapshot: FirebaseDataSnapshot): void {
        console.log('UpdatedDataKey: ', snapshot.key());
        console.log('UpdatedData: ', snapshot.val());

        this.game.next(snapshot.val());
    }

    private generateGame(data: any, gameOptions: GameOptions): IGame {

        console.log('inside Set Cards');
        console.log(data);
        console.log('gameOptions', gameOptions);



        let articles: any[] = data.content;
        let cards: ICard[] = [];

        this.addCards(articles, cards);
        this.addCards(articles, cards);

        cards = this.shuffleCards(cards);

        let game: IGame = new Game(cards, articles.length, gameOptions);

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

    private findGame(games: IGame[], key: string) : IGame {
        if (games.hasOwnProperty(key)) {
            games[key].key = key;
            return  games[key];
        }

        return undefined;
    }
}