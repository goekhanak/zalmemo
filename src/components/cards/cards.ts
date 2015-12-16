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

        return card.id !== this.game.firstPickId && card.id !== this.game.secondPickId ? true : false;
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

        let firstPick: ICard = this.getCardForId(this.game.firstPickId);
        let secondPick: ICard = this.getCardForId(this.game.secondPickId);


        // FirstPick need to be
        if (!firstPick || secondPick) {

            if (secondPick) {
                this.flip(firstPick);
                this.flip(secondPick);
                this.game.firstPickId = this.game.secondPickId = '';
            }

            this.game.firstPickId = card.id;


        } else {

            // Do we have a match
            if (firstPick.configSku === card.configSku) {
                this.game.unmatchedPairs--;
                this.game.firstPickId = this.game.secondPickId = '';
            } else { // no match
                this.game.secondPickId = card.id;
            }
        }

        this.gameService.updateGame(this.game);
    }

    private flip(card: ICard) {


        if (!card.flipped) {
            card.flipped = true;
        } else {
            card.flipped = false;
        }
    }

    private getCardForId(cardId) : ICard {
        let card: ICard;
        for (let i : number = 0; i < this.game.cards.length; i++) {
            if (this.game.cards[i].id === cardId) {
                card = this.game.cards[i];
            }
        }

        console.error('No Card found for id ', cardId);

        return card;
    }
}