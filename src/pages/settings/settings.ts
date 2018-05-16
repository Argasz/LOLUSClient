import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase/app';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    user: firebase.User;
    username: string;
    photoURL: string
    events: Events;

  constructor(public navCtrl: NavController, public navParams: NavParams, events: Events) {
      console.log(firebase.auth().currentUser);
      this.user = firebase.auth().currentUser;
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;
      this.events = events;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  setAvstand(avstand: number){
    this.events.publish('slider:change', avstand);
  }

}
