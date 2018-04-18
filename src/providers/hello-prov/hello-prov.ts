import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observer} from 'rxjs/Observer';

/*
  Generated class for the helloProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
    static getHello(): any {
        throw new Error("Method not implemented.");
    }
  and Angular DI.
*/
@Injectable()
export class helloProvider {
  httpObs: Observer<string>;

  constructor(public http: HttpClient) {}
  getHello(){
    this.http.get('https://pvt.dsv.su.se/Group07/hello',{responseType: 'text'}).subscribe(obs =>this.httpObs);
    return this.httpObs;
  }

}
