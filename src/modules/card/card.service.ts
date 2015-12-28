import { Injectable } from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {GameOptions} from "./card";

@Injectable()
export class CardService {
    constructor(private http: Http) { }


    public getCards(gameOptions: GameOptions) {
        // we can change Zalando Shop based on the language
        let options = new RequestOptions({
            headers: new Headers({ 'Accept-Language': 'en-EN',
                'x-client-name' : 'zalmemo'
            })
        });
        // configure category and number of random items to retrieve
        let category = gameOptions.category;
        let numberOfItems = gameOptions.level.pairs;

        let resourceURL = 'https://api.zalando.com/articles?category=' + category + '&pageSize=1&page=';
        return this.http.get(resourceURL + 1, options)
            .map(res => { return res.json().totalPages })
            .map(totalPages => {
                let randomPageList: number[] = [];
                while (randomPageList.length < numberOfItems) {
                    var randomPageId = Math.floor(Math.random() * totalPages - 1) + 1;
                    if (randomPageList.indexOf(randomPageId) == -1) {
                        randomPageList.push(randomPageId);
                    }
                }
                return randomPageList;
            })
            .flatMap(pageList => {
                var list: Observable<any>[] = [];
                pageList.forEach(i=> list.push(this.http.get(resourceURL + i, options)))
                return Observable.forkJoin(list, function(...responses:any[]) {
                    var articleList: any[] = [];
                    responses.forEach(res => articleList.push(res.json().content[0]));

                    return {
                        content: articleList
                    }
                });
            });
    }

}
