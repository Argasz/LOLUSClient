import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    posts: any;
    myNav: NavController;

  constructor(public navCtrl: NavController, public rest: RestProvider) {
    this.myNav = navCtrl;
      this.getJens();
  }

  getJens() {
      this.rest.getJens().then(
          data => {
              this.posts = data;
              console.log(this.posts);
          }
      )
  }

  clickEvent(e){
    this.myNav.push(TabsPage);
  }
}
