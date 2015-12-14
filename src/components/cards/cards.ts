import { Component, View } from 'angular2/core';
import { CanActivate } from 'angular2/router';
import { AuthRouteHelper } from '../../core/auth/auth-route-helper';
import { CardService } from '../../core/card/card.service';
import { NgFor } from 'angular2/common';
import { ICard } from  '../../core/card/card'




const template: string = require('./cards.html');


@Component({
    selector: 'cards'
})

@View({
    directives: [
        NgFor
    ],
    template
})

@CanActivate(() => AuthRouteHelper.requireAuth())

export class Cards {
    public cards : ICard[];

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
}