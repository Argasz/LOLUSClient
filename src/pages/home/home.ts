import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    posts: any;
    hello: string;

  constructor(public navCtrl: NavController, public http: Http) {

      this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
        this.posts = data.data.children;
    });
      this.http.get('https://pvt.dsv.su.se/Group07/hello').map(helloRes => helloRes.text()).subscribe(text => {
        this.hello = text.toString();
      });
  }

}
