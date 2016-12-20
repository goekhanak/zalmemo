import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';
import { AuthRouteHelper } from 'modules/auth/auth-route-helper';
import { AuthService } from 'modules/auth/auth-service';
import { SignIn } from '../sign-in/sign-in';
import { Tasks } from '../tasks/tasks';
import { Cards } from '../cards/cards'
import {CreateGame} from '../create/create'
import {Games} from "../games/games";

const styles: string = require('./app.scss');
const template: string = require('./app.html');


@Component({
  directives: [
    RouterOutlet,
    RouterLink
  ],
  selector: 'app',
  styles: [styles],
  template
})

@RouteConfig([
  {path: '/', component: SignIn, as: 'SignIn'},
  {path: '/tasks', component: Tasks, as: 'Tasks'},
  {path: '/create', component: CreateGame, as: 'CreateGame'},
  {path: '/cards/:key', component: Cards, as: 'Cards'},
  {path: '/games', component: Games, as: 'Games'}
])

export class App {
  authenticated: boolean = false;

  constructor(private auth: AuthService, routeHelper: AuthRouteHelper) {
    auth.subscribe((authenticated: boolean) => {
      this.authenticated = authenticated;
    });
  }

  signOut(): void {
    this.auth.signOut();
    window.location.replace('/');
  }


  navigateToMainScreen(): void {
    window.location.replace('/');
  }

}
