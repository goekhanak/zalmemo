import { provide } from 'angular2/core';
import { FIREBASE_CARDS_URL } from '../../config';
import { AuthService } from '../auth/auth-service';
import { GameService } from './game.service';
import { CardService } from './card.service'


export const CARD_PROVIDERS: any[] = [
  provide(GameService, {
    deps: [AuthService, CardService],
    useFactory: (auth: AuthService, cardService: CardService): GameService => {
      return new GameService(new Firebase(`${FIREBASE_CARDS_URL}/${auth.id}`), cardService);
    }
  })
];
