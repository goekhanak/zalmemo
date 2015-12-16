import { Component, View } from 'angular2/core';
import { CanActivate } from 'angular2/router';
import { AuthRouteHelper } from '../../modules/auth/auth-route-helper';
import { CardService } from '../../modules/card/card.service';
import { GameService } from '../../modules/card/game.service';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ICard } from  '../../modules/card/card'
import {Card} from "../../modules/card/card";
import {Game} from "../../modules/card/card";
import {IGame} from "../../modules/card/card";


const styles: string = require('./cards.scss');
const template: string = require('./cards.html');


@Component({
    selector: 'cards'
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

export class Cards {
    public game : IGame;


    constructor(  public gameService: GameService) {

        gameService.getGame().then((game: IGame) => {
            console.log('Promise resolved !');
            console.log(game);
            this.game = game;
        });
    }

    logError(err) {
        console.error('There was an error: ' + err);
    }


    isCardRevealed(card: ICard){

        if(this.game.unmatchedPairs === 0){
            return false;
        }

        return card !== this.game.firstPick && card !== this.game.secondPick ? true : false;
    }




    onDoubleClick(card:ICard){
        console.log('Double Click:' + card.id);

        if(this.game.unmatchedPairs === 0){
            window.open(card.shopUrl);
        }
    }

    pickCard(card:ICard){
        console.log('Flip Card:' + card.id);

        // ignore the flipped ones
        if (card.flipped) {
            return;
        }

        this.flip(card);

        // FirstPick need to be
        if (!this.game.firstPick || this.game.secondPick) {

            if (this.game.secondPick) {
                this.flip(this.game.firstPick)
                this.flip(this.game.secondPick)
                this.game.firstPick = this.game.secondPick = undefined;
            }

            this.game.firstPick = card;


        } else {

            // Do we have a match
            if (this.game.firstPick.id === card.id) {
                this.game.unmatchedPairs--;
                this.game.firstPick = this.game.secondPick = undefined;
            } else { // no match
                this.game.secondPick = card;
            }
        }
    }

    private flip(card) {
        if (!card.flipped) {
            card.flipped = true;
        } else {
            card.flipped = false;
        }
    };
}