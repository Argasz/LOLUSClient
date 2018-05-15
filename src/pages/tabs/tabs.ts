import { Component } from '@angular/core';
import {KartaPage} from "../karta/karta";
import {HändelserPage} from "../händelser/händelser";
import { SettingsPage } from "../settings/settings";
import {HomePage} from "../home/home";
import {NavController} from "ionic-angular";
import * as firebase from 'firebase/app';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = KartaPage;
  tab2Root = HändelserPage;
  tab3Root = SettingsPage;
  user: firebase.User;

  myNav: NavController;
  constructor(public navCtrl: NavController) {
    this.myNav = navCtrl;
    this.user = firebase.auth().currentUser;
  }

  goHome(){
    this.myNav.push(HomePage);
  }
}
