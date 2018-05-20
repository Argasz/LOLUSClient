import { Component } from '@angular/core';
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
    if(this.user){
      console.log(firebase.auth().currentUser);
      this.user = firebase.auth().currentUser;
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;
    } else {
      this.username = 'Aron Gassilewski';
      this.photoURL = 'https://avatars2.githubusercontent.com/u/37187624?s=400&u=b6a74eb2efcf0f87c5ccc6fd75d880c1bdc48192&v=4';
      this.events = events;
      this.hasChanges = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ionViewWillEnter(){
    this.hasChanges = false;
  }

  ionViewWillLeave() {
    if(this.hasChanges){
      this.events.publish("slider:change", this.avstand);
    }
  }

  hasChanged(){
    this.hasChanges = true;
  }
}
