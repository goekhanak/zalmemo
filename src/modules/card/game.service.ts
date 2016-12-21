import {IGame, GameType, UserScore, UserGameResult} from './card'
import {CardService} from './card.service'
import {ICard} from "./card";
import {Card} from "./card";
import {Game} from "./card";
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {GameOptions} from "./card";
import {LegacyHtmlParser} from "angular2/src/compiler/legacy_template";
import {Level} from "./card";
import {Participant} from "./card";
import {FIREBASE_PRESENCE, FIREBASE_SCORES} from "../../config";
import {AuthService} from "../auth/auth-service";


export class GameService {

    game: ReplaySubject<IGame> = new ReplaySubject(1);
    activeUsers: Participant[];
    oldGameRef: Firebase;
    participantsRef: Firebase;
    gamePushed: boolean = false;
    private scoresRef;

    constructor(private ref: Firebase, private cardService: CardService, private authService: AuthService) {
        this.participantsRef = new Firebase(FIREBASE_PRESENCE);
        this.scoresRef = new Firebase(FIREBASE_SCORES);

        this.loadActiveUsers();
    }




    public getMultiplayerGames(): Promise<Game[]> {

        return new Promise((resolve, reject) => {
            this.ref.orderByChild('unmatchedPairs').startAt(1).once("value", (snapshot) => {
                console.log("Uncompleted games: ", snapshot.val());
                resolve(this.filterGamesWithPresences(snapshot.val()));
            }, function (err) {
                console.log('The read failed: ', err.code);
                reject(err);
            });
        });
    }

    public loadActiveUsers(): void {
        this.participantsRef.once("value", (snapshot) => {
            var presences = snapshot.val();
            console.log('Participants: ', presences);
            this.activeUsers = this.mapToParticipantArray(snapshot.val());
            console.log('this.activeUsers: ', presences);

            this.subscribeParticipantUpdates();
        }, function (err) {
            console.log('The  failed: ', err.code);
        });
    }

    private mapToParticipantArray(presences: any) {
        let participants: Participant[] = [];

        for (var userId in presences) {
            if (presences.hasOwnProperty(userId)) {
                participants.push(presences[userId]);
            }
        }
        return participants;
    };

    private subscribeParticipantUpdates() {
        this.participantsRef.on('value', this.listenParticipantUpdates.bind(this));
    }

    private listenParticipantUpdates(snapshot: FirebaseDataSnapshot): void {
        console.log('Updated Participant DataKey: ', snapshot.key());
        console.log('Updated Participant Data: ', snapshot.val());

        this.activeUsers = this.mapToParticipantArray(snapshot.val());
    }

    public createNewGame(gameOptions: GameOptions) {
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
        console.log('Inside get game with key: ', key);

        console.log('this.ref.key(): ', this.ref.key());

        let gameRef: Firebase = this.ref.child(key);

        console.log('gameRef.key(): ', gameRef.key());
        console.log('this.ref.key(): ', this.ref.key());

        return new Promise((resolve, reject) => {

            gameRef.once("value", (snapshot) => {
                console.log('Current Game: ', snapshot.val());

                let unfinishedGame: IGame = snapshot.val();
                if (unfinishedGame) {
                    //  for easy identification
                    unfinishedGame.key = key;
                    this.subscribeGameUpdates(unfinishedGame);
                    resolve(unfinishedGame);
                }
            }, function (err) {
                console.log("The read failed: ", err.code);
                reject(err);
            });
        });
    }


    public updateGame(game: IGame) {
        this.ref.child(game.key).update(game, (error: Error) => {
            if (error) {
                console.error('ERROR @ updateGame :', error);
            }
        });
    }

    private subscribeGameUpdates(game: IGame) {

        console.log('subscribeUpdates:', this.oldGameRef);

        if (this.oldGameRef) {
            this.oldGameRef.off('value', this.listenGameUpdates.bind(this));
        }

        let gameRef: Firebase = this.ref.child(game.key);
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
        let newRef = this.ref.push(game, (error: Error) => {
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

    private logError(err): void {
        console.error('There was an error: ' + err);
    }

    private findGame(games: IGame[], key: string): IGame {
        if (games.hasOwnProperty(key)) {
            games[key].key = key;
            return games[key];
        }

        return undefined;
    }

    private filterGamesWithPresences(uncompletedGames: any): IGame[] {

        let filteredGames: IGame[] = [];

        for (var key in uncompletedGames) {
            let game: IGame = uncompletedGames[key];

            game.key = key;

            if (game.created) {
                game.created = new Date(game.created);
            }


            if (game.options.gameType && game.options.gameType === GameType.MULTIPLAYER && this.isCreatorActive(game)) {
                filteredGames.push(game);
            }
        }

        return filteredGames;
    }

    private isCreatorActive(game: IGame) {

        if (!this.activeUsers) {
            console.error('No active users for filtering!');
            return true
        }

        let gameCretorId = game.options.participants[0].id;

        for (var i = 0; i < this.activeUsers.length; i++) {
            let user: Participant = this.activeUsers[i];

            if (gameCretorId === user.id) {
                return true;
            }
        }

        return false;
    }


    /*Game score update related staff*/

    public updateGameScore(game: IGame) {

        // No need to update score for single player games
        if (game.options.gameType == GameType.SINGLE) {
            return;
        }

        if (this.gamePushed === true) {
            return;
        }

        for (var i = 0; i < game.options.participants.length; i++) {

            var user: Participant = game.options.participants[i];

            let userGameResult : UserGameResult = this.getUserGameResult(game, user.id);
            this.updateUserScore(user, userGameResult);

            this.gamePushed = true;
        }
    }

    private getUserGameResult(game: IGame, userId: string) : UserGameResult{
        let winner: Participant = game.options.participants[0];
        let isDraw: boolean = true;


        for (let i = 1; i < game.options.participants.length; i++) {
            let participant = game.options.participants[i];

            if (participant.score !== winner.score) {
                isDraw = false;
            }

            if (participant.score > winner.score) {
                winner = participant;
            }
        }

        if(isDraw === true){
            return UserGameResult.DRAW;
        }else if(winner.id !== userId){
            return UserGameResult.LOSE;
        }else{
            return UserGameResult.WIN;
        }
    }

    private updateUserScore(user: Participant, userGameResult : UserGameResult) {
        let userScoreRef = this.scoresRef.child(user.id);

        userScoreRef.once('value', (snapshot) => {
            console.log("Get userScoreRef: ", snapshot.val());

            let score: UserScore;

            if (!snapshot.val()) {
                score = new UserScore(user.id, user.displayName, user.profileImageURL);
            } else {
                score = snapshot.val();
            }

            switch (userGameResult){
                case UserGameResult.WIN :
                    score.wins++;
                    break;
                case UserGameResult.LOSE :
                    score.loses++;
                    break;
                case UserGameResult.DRAW :
                    score.draw++;
                    break;
            }

            console.log('userScoreRef: ', userScoreRef.key());
            console.log('score: ', score);

            userScoreRef.set(score,   (err) => {
                console.log("set score card failed: ", err);
            });

        }, function (err) {
            console.log('Error userScoreRef: ', err.code);
        });
    }

}