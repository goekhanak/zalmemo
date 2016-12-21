import {Component, View} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {AuthRouteHelper} from '../../modules/auth/auth-route-helper';
import {GameService} from '../../modules/card/game.service';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ICard, GameType} from  '../../modules/card/card'
import {Card} from "../../modules/card/card";
import {Game} from "../../modules/card/card";
import {IGame} from "../../modules/card/card";
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Input} from "angular2/core";
import {RouteParams} from "angular2/router";
import {Participant} from "../../modules/card/card";
import {Router} from "angular2/src/router/router";
import {AuthService} from "../../modules/auth/auth-service";


const styles: string = require('./games.scss');
const template: string = require('./games.html');


@Component({
    selector: 'games'
})

@View({
    styles: [styles],
    directives: [
        CORE_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    template
})

@CanActivate(() => AuthRouteHelper.requireAuth())

export class Games {
    public currentUser: Participant;
    public currentGames: IGame[];

    constructor(public gameService: GameService, private router: Router, private authService: AuthService) {

        this.currentUser = this.authService.currentUser();
        this.loadMultiplayerGames();

        // Loading games every 20 seconds
        // TODO: listen to presences and child_added of games
        setInterval(() => {this.loadMultiplayerGames()}, 1000 * 20 );
    }

    private loadMultiplayerGames() {
        this.gameService.getMultiplayerGames().then((games: IGame[]) => {
            console.log('getMultiplayerGames Promise resolved !');
            console.log(games);
            this.currentGames = games;
        });
    }

    public joinGame(game: IGame){
        this.router.navigate(['/Cards', {key: game.key}]);
    }

    public navigateTocreateGame(): void{
        console.log('inside navigateTocreateGame!');
        this.router.navigate(['/CreateGame']);
    }
}