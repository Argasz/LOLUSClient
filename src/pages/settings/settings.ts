import { Component } from '@angular/core';
import { HomePage } from "../home/home";
import { NavController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase/app';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    user: firebase.User;
    username: string;
    photoURL: string;
    events: Events;
    avstand: number;
    hasChanges: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, events: Events) {
      this.user = firebase.auth().currentUser;
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;
      this.events = events;
      this.avstand = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ionViewWillEnter(){
    this.hasChanges = false;
  }

  ionViewDidLeave() {
    if(this.hasChanges){
      this.events.publish("slider:change", this.avstand);
    }
  }

  hasChanged(){
    this.hasChanges = true;
  }

  goHome(){
   this.events.publish('user:signout');
  }

}
