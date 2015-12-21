[![Build Status](https://travis-ci.org/r-park/todo-angular2-firebase.svg?branch=master)](https://travis-ci.org/r-park/todo-angular2-firebase)


# ZalMemo a social memory game with Zalando API.
A simple Todo app example built with **Angular 2**. The app features a **Firebase** backend with **OAuth** authentication, and uses **<a href="https://github.com/zalando/shop-api-documentation" target="_blank">Zalando Shop API</a>**. It is built within Zalando hackweek 2015.

Try out the live demo at <a href="https://crackling-inferno-6105.firebaseapp.com/" target="_blank">https://crackling-inferno-6105.firebaseapp.com</a>

Check out the <a href="https://github.com/r-park/todo-angular2-firebase" target="_blank">todo-angular2-firebase</a> this project is based on.

- Angular `2.0.0-beta.0`
- Firebase
  - JSON Datastore
  - OAuth authentication with GitHub, Google, and Twitter
  - Hosting
- Gulp `4.0.0-alpha.2`
- Immutable
- RxJS `5.0.0-beta.0`
- SASS
- Typescript `~1.7.5`
- Webpack
  - Inlines external SCSS files
  - Inlines external HTML templates
  - Bundles and minifies release builds
  - Injects style and script tags into index.html


## Hackweek Schedule

* First day
  * Get Familiar with Angular 2
    * go through tutorials and docs.
  * Find a seed project with Angular 2, Typescript and Firebase
    * <a href="https://github.com/r-park/todo-angular2-firebase" target="_blank">todo-angular2-firebase</a>
  * Get familiar with shop API
    * <a href="https://github.com/zalando/shop-api-documentation" target="_blank">Zalando Shop API</a>
  * Design the first GUI
* Second day
  * Develop the UI
    * Flip Cards with animations
  * Get articles from Shop API
* Third day
  * Responsive UI
  * Store the game @Firebase 
    * https://www.youtube.com/watch?v=RD0xYicNcaY
  * Improve random article choosing
* Fourth day
  * Real-time Synchronization among various clients with Firebase
  * Choose game options like difficulty level and 
* Fifth day
  * Prepare for project fair
  * Get feedback

### Future Work
* Turn based game against each other
* Make clicking on cards will redirect to Zalando Shop more intuative


## Quick Start
```bash
$ git clone git@github.com:zalando/zalmemo.git
$ cd zalmemo
$ npm install
$ ./node_modules/.bin/gulp
```


## Developing
### Prerequisites
- `node >=4.2`

### Installing Global Dependencies
```bash
$ npm install -g karma-cli
```

##### Webpack (optional)
```bash
$ npm install -g webpack
$ npm install -g webpack-dev-server
```

##### Gulp v4 (optional)
```bash
$ npm install -g gulpjs/gulp-cli#4.0
```
The gulp tasks for this project require gulp v4-alpha. If you don't wish to globally install the v4 gulp-cli, you can run the gulp tasks using the locally installed gulp under `./node_modules/.bin` — for example:
```bash
$ ./node_modules/.bin/gulp run
```


### Installing Project-local Dependencies
```bash
$ npm install
```


## Commands
#### Develop
```bash
$ gulp
```
- Start the Webpack dev server at <a href="http://localhost:3000" target="_blank">localhost:3000</a>
- Watch for changes to your source files
- Live-reload the browser

#### Lint (tslint)
```bash
$ gulp lint
```

#### Test (single-run)
```bash
$ gulp test
```

#### Test (watch mode)
```bash
$ gulp test.watch
```

#### Build
```bash
$ gulp build
```

#### Dist build
```bash
$ gulp dist
```
Executes the following:
- `gulp lint`
- `gulp test`
- `gulp build`
