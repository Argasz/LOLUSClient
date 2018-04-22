import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public myNav:NavController;
  constructor(public navCtrl: NavController) {
    this.myNav = this.navCtrl;
     /* this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
        this.posts = data.data.children;
    });*/
  }

  clickEvent(e){
    this.myNav.push(TabsPage);
  }
}
