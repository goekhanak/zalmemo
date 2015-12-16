import { enableProdMode, provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';


// root component
import { App } from './components/app/app';

// modules
import { AUTH_PROVIDERS } from './modules/auth/providers';
import { TASK_PROVIDERS } from './modules/task/providers';
import { CARD_PROVIDERS } from './modules/card/card.providers';


import {CardService} from './modules/card/card.service'

// global styles
import './styles/styles.scss';


Firebase.INTERNAL.forceWebSockets();

enableProdMode();

bootstrap(App, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  AUTH_PROVIDERS,
  TASK_PROVIDERS,
  CARD_PROVIDERS,
  CardService,
  provide(APP_BASE_HREF, {useValue: '/'})
]).catch((error: Error) => console.error(error));
