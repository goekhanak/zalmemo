import { Component, View } from 'angular2/core';
import { CanActivate } from 'angular2/router';
import { AuthRouteHelper } from '../../core/auth/auth-route-helper';
import { CardService } from '../../core/card/card.service';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ICard } from  '../../core/card/card'


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
    public cards : ICard[];
    private firstPick : ICard;
    private secondPick: ICard;

    constructor( public cardService :CardService) {
        cardService.getCards().subscribe(
            data => this.setCards(data),
            err => this.logError(err)
        );
    }

    logError(err) {
        console.error('There was an error: ' + err);
    }

    setCards(data){
        console.log('Successfully get payload: ' + data);
        console.log('Successfully get payload jsonResponse: ' + data);
        this.cards = data.content;
    }

    pickCard(card:ICard){
        console.log('Flip Card:' + card.id);

        // ignore the flipped ones
        if (card.flipped) {
            return;
        }

        this.flip(card);

        // FirstPick need to be
        if (!this.firstPick || this.secondPick) {

            if (this.secondPick) {
                this.flip(this.firstPick)
                this.flip(this.secondPick)
                this.firstPick = this.secondPick = undefined;
            }

            this.firstPick = card;


        } else {

            // Do we have a match
            if (this.firstPick.id === card.id) {
                this.firstPick = this.secondPick = undefined;
            } else { // no match
                this.secondPick = card;
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