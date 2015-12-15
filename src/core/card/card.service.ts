import { Injectable } from 'angular2/core';
import {Http} from 'angular2/http';



@Injectable()
export class CardService {
    constructor(private http: Http) {}


    public getCards (){
        var page = Math.floor(Math.random()*300);
        console.log('i :' +page );

        return this.http.get('https://api.zalando.com/articles?category=kids&pageSize=6&page='+page)
            .map(res => res.json());
    }

}