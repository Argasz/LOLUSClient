import { Component } from '@angular/core';
import {KartaPage} from "../karta/karta";
import {HappeningsPage} from "../happenings/happenings";
import { SettingsPage } from "../settings/settings";
import {HomePage} from "../home/home";
import {NavController, Events, App} from "ionic-angular";
import * as firebase from 'firebase/app';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HappeningsPage;
  tab2Root = KartaPage;
  tab3Root = SettingsPage;
  user: firebase.User;
  private app;

  myNav: NavController;
  constructor(public navCtrl: NavController, public events: Events, private apps: App) {
    this.myNav = navCtrl;
    this.user = firebase.auth().currentUser;
    this.app = apps;
    this.events.subscribe('user:signout', ()=>{
      this.goHome();
   })
  }

  goHome(){
    firebase.auth().signOut();
    window.location.reload(true);
    this.app.getRootNav().popToRoot();
  }
}
