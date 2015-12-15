import { Injectable } from 'angular2/core';
import {Http} from 'angular2/http';


@Injectable()
export class CardService {
    constructor(private http: Http) {}


    public getCards (){
        return this.http.get('https://api.zalando.com/articles?category=womens-shoes&pageSize=12')
            .map(res => res.json());
    }

}