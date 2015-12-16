import { Injectable } from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';


@Injectable()
export class CardService {
    constructor(private http: Http) {}


    public getCards (){
        var page = Math.floor(Math.random()*300);
        console.log('i :' +page );

        // we can change Zalando Shop based on the language
        let options = new RequestOptions({
            headers: new Headers({'Accept-Language': 'en-EN'})
        });

        return this.http.get('https://api.zalando.com/articles?category=kids&pageSize=6&page='+page, options)
            .map(res => res.json());
    }

}