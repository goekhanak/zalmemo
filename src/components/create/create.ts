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

    constructor(public gameService: GameService,  private router: Router) {

        // TODO get categories from shop api
        this.categories = ['Women','Men','Kids'];
        this.levels= [
            new Level(6, 'Easy'),
            new Level(9, 'Fair'),
            new Level(12, 'Hard')
        ];
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

        let gameOptions: GameOptions = new GameOptions(this.selectedCategory, this.selectedLevel);
        this.gameService.createNewGame(gameOptions).then(
            (game: IGame) =>{
                // TODO use game id in the url
                this.router.navigate(['/Cards']);
            }
        );

        console.log('inside create game');
        // TODO
    }
}