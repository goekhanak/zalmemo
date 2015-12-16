import { Component, View } from 'angular2/core';
import { CanActivate } from 'angular2/router';
import { AuthRouteHelper } from '../../core/auth/auth-route-helper';
import { CardService } from '../../core/card/card.service';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ICard } from  '../../core/card/card'
import {Card} from "../../core/card/card";


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
    public unmatchedPairs;
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
        this.cards = [];
        this.unmatchedPairs = data.content.length;
        this.addCardsRandomly(data);
        this.addCardsRandomly(data);
    }

    isCardRevealed(card: ICard){

        console.log('isCardRevealed unmatchedPairs' + this.unmatchedPairs + ' card id: ' + card.id);

        if(this.unmatchedPairs === 0){
            return false;
        }

        return card !== this.firstPick && card !== this.secondPick ? true : false;
    }

    private addCardsRandomly(data) {
        data.content = this.shuffle(data.content);
        for (var i = 0; i < data.content.length; i++) {
            let article: any = data.content[i];

            console.log('Article: ' + article);

            let card: ICard = new Card(article.id, article.name, article.shopUrl, article.media.images[0].mediumUrl);
            this.cards.push(card);
        }
    };

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

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

    onDoubleClick(card:ICard){
        console.log('Double Click:' + card.id);

        if(this.unmatchedPairs === 0){
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
                this.unmatchedPairs--;
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