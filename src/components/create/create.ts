import { Component, View } from 'angular2/core';
import { CanActivate } from 'angular2/router';
import { AuthRouteHelper } from '../../modules/auth/auth-route-helper';
import { CardService } from '../../modules/card/card.service';
import { GameService } from '../../modules/card/game.service';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import {Game} from "../../modules/card/card";
import {IGame} from "../../modules/card/card";
import {Level} from "../../modules/card/card";
import {GameOptions} from "../../modules/card/card";
import {Router} from "angular2/router";
import {AuthService} from "../../modules/auth/auth-service";
import {Participant} from "../../modules/card/card";


const template: string = require('./create.html');

const styles: string = require('./create.scss');


@Component({
    selector: 'create'
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

export class CreateGame {
    public game : IGame;
    public categories: string [];
    public selectedCategory: string;
    public levels: Level[];
    public selectedLevel: Level;
    public opponentCandidates :Participant[];
    public selectedOpponent: Participant;

    constructor(public gameService: GameService,  private router: Router, private authService: AuthService) {

        // TODO get categories from shop api
        this.categories = ['women','men','kids'];
        this.levels= [
            new Level(6, 'Easy'),
            new Level(9, 'Fair'),
            new Level(12, 'Hard')
        ];

        gameService.getGameOpponentCandidates().then((opponentCandidates: Participant[]) => {
            console.log('opponentCandidates: ', opponentCandidates);
            this.opponentCandidates = opponentCandidates;
        });

        this.gameService.opponentCandidates.subscribe((data: Participant[]) =>{
            console.log('Inside gameService.opponentCandidates.subscribe: ', data);
            this.opponentCandidates = data;
        } );
    }

    public isCategorySelected(category: string) : boolean{
        return category === this.selectedCategory;
    }

    public selectCategory(category: string) : void{
        this.selectedCategory = category;
    }

    public isLevelSelected(level: Level) : boolean{
        return level === this.selectedLevel;
    }

    public selectLevel(level: Level) : void{
        this.selectedLevel = level;
    }

    public gameOptionsChosen(): boolean{
        return this.selectedCategory !== undefined && this.selectedLevel !== undefined;
    }

    public createGame() : void{
        if(!this.gameOptionsChosen()){
            return;
        }

        let participants: Participant[] = [];
        participants.push(this.authService.currentUser());

        if(this.opponentCandidates.length > 0){

            console.log('this.opponentCandidates', this.opponentCandidates);
            console.log('this.opponentCandidates[0]', this.opponentCandidates[0]);

            this.selectedOpponent = this.opponentCandidates[0];

            participants.push(this.selectedOpponent);
        }

        let gameOptions: GameOptions = new GameOptions(this.selectedCategory, this.selectedLevel, participants);
        this.gameService.createNewGame(gameOptions).then(
            (game: IGame) =>{
                console.log('inside create game key:  ', game.key);

                this.router.navigate(['/Cards', {key: game.key}]);
            }
        );
    }
}