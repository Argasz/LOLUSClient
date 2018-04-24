import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
Generated class for the RestProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class RestProvider {

    private apiUrl = 'http://localhost:8080';
    private data: any;

    constructor(public http: HttpClient) {
        //console.log('Hello RestServiceProvider Provider');
    }

    getJens() {
        return new Promise(resolve => {
            this.http.get(this.apiUrl+'/jens').subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

}
