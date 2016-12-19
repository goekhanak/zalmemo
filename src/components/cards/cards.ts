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
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
import {Input} from "angular2/core";
import {RouteParams} from "angular2/router";
import {Participant} from "../../modules/card/card";
import {Router} from "angular2/src/router/router";
import {AuthService} from "../../modules/auth/auth-service";


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
    public currentUser: Participant;


    constructor(public gameService: GameService, params: RouteParams, private router: Router, private authService: AuthService) {

        console.log('params.get(key): ' , params.get('key'));

        this.currentUser = this.authService.currentUser();

        let gameKey = params.get('key');

        gameService.getGame(gameKey).then((game: IGame) => {
            console.log('Promise resolved !');
            console.log(game);
            this.game = game;
            this.joinGame();
        });
    }

    private joinGame() {
        if (this.isCurrentUserAlreadyInParticipants()) {
            console.log('Current user is already among participants: ', this.currentUser);

        } else if (this.game.options.participants.length > 1) {
            // TODO show warning
            console.log('There are already enough pariticipants: ', this.currentUser);
            this.router.navigate(['/']);
        } else {
            console.log('Adding new participant to the game: ', this.currentUser);
            this.currentUser.score = 0;
            this.game.options.participants.push(this.currentUser);
            this.gameService.updateGame(this.game);
        }

        this.gameService.game.subscribe((data: IGame) => {
            console.log('Inside Subscribe: ', data);

            if (data) {
                this.updateView(data);
            }
        });
    }

    updateView(updatedGame: IGame) : void {
        if(this.game.firstPickId  !== updatedGame.firstPickId){
            this.game.firstPickId = updatedGame.firstPickId;
        }

        if(this.game.secondPickId  !== updatedGame.secondPickId){
            this.game.secondPickId = updatedGame.secondPickId;
        }

        for(let i= 0; i < this.game.cards.length && i < updatedGame.cards.length  ;i++){
            if(this.game.cards[i].flipped !== updatedGame.cards[i].flipped){
                this.game.cards[i].flipped = updatedGame.cards[i].flipped;
            }
        }

        if(this.game.unmatchedPairs  !== updatedGame.unmatchedPairs){
            this.game.unmatchedPairs  = updatedGame.unmatchedPairs;
        }

        if(this.game.flipCounter  !== updatedGame.flipCounter){
            this.game.flipCounter  = updatedGame.flipCounter;
        }

        if(this.game.turn  !== updatedGame.turn){
            this.game.turn  = updatedGame.turn;
        }




        for(let i= 0; i < updatedGame.options.participants.length ;i++){

            // new participant
            if(!this.game.options.participants[i]){
                this.game.options.participants.push(updatedGame.options.participants[i]);
            }

            if(this.game.options.participants[i].score !== updatedGame.options.participants[i].score){
                this.game.options.participants[i].score = updatedGame.options.participants[i].score;
            }
        }
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

    isCurrentUserTurn(participant: Participant): boolean{
        return participant.id === this.game.turn;
    }


    onDoubleClick(card:ICard){

        console.log('Double Click:' + card.id);
        console.log('this.gameSubject: ', this.gameService.game);

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

        // ignore if it is not current users turn
        if(this.gameService.currentUserTurn(this.game) === false){
            return;
        }

        this.flip(card);

        this.game.flipCounter++;

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
                this.incrementScore();
                this.game.firstPickId = this.game.secondPickId = '';

                // game over
                if(this.game.unmatchedPairs === 0){
                    alert('Congratulations you revealed all cards in ' + this.game.flipCounter/2+' attempts! ' +
                        '\n You can double click on any article to display at Zalando shop.')
                }

            } else { // no match
                this.game.secondPickId = card.id;
                this.nextParticipantsTurn();
            }
        }

        this.gameService.updateGame(this.game);
    }


    private incrementScore() : void{
        for(let i = 0; i < this.game.options.participants.length; i++){
            let participant = this.game.options.participants[i];

            if(participant.id === this.game.turn){
                participant.score++;
                break;
            }
        }
    }

    private nextParticipantsTurn() : void{
        for(let i = 0; i < this.game.options.participants.length; i++){
            let participant = this.game.options.participants[i];

            if(participant.id !== this.game.turn){
                this.game.turn = participant.id;
                break;
            }
        }
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

        return card;
    }

    private isCurrentUserAlreadyInParticipants() : boolean{
        for(let i = 0; i < this.game.options.participants.length; i++){
            let participant = this.game.options.participants[i];

            if(participant.id === this.currentUser.id){
                return true;
            }
        }

        return false;
    }
}