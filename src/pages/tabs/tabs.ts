import { Component } from '@angular/core';
import {KartaPage} from "../karta/karta";
import {HändelserPage} from "../händelser/händelser";
import {HomePage} from "../home/home";
import {NavController} from "ionic-angular";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = KartaPage;
  tab2Root = HändelserPage;
  myNav: NavController;
  constructor(public navCtrl: NavController) {
    this.myNav = navCtrl;
  }

  goHome(){
    this.myNav.push(HomePage);
  }

}
