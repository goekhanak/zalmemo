import {Component, View} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {AuthRouteHelper} from '../../modules/auth/auth-route-helper';
import {GameService} from '../../modules/card/game.service';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ICard, GameType, UserScore} from  '../../modules/card/card'
import {Card} from "../../modules/card/card";
import {Game} from "../../modules/card/card";
import {IGame} from "../../modules/card/card";
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Input} from "angular2/core";
import {RouteParams} from "angular2/router";
import {Participant} from "../../modules/card/card";
import {Router} from "angular2/src/router/router";
import {AuthService} from "../../modules/auth/auth-service";


const styles: string = require('./standings.scss');
const template: string = require('./standings.html');


@Component({
    selector: 'scoreboard'
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

export class Standings {
    public currentUser: Participant;
    public standings: UserScore[];

    constructor(public gameService: GameService, private router: Router, private authService: AuthService) {

        this.currentUser = this.authService.currentUser();
        this.loadMultiplayerGames();

        // Loading games every minute
        // TODO: listen to presences and child_added of games
        setInterval(() => {this.loadMultiplayerGames()}, 1000 * 60 );
    }

    private loadMultiplayerGames() {
        this.gameService.getStandings().then((standings: UserScore[]) => {
            console.log('getStandings Promise resolved !');
            console.log(standings);
            this.standings = standings;
        });
    }
}