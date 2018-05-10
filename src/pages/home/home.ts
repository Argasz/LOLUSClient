import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { WelcomePage } from "../welcome/welcome";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    posts: any;
    myNav: NavController;

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth) {
    this.myNav = navCtrl;
  }

  signInWithFacebook() {
      this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  clickEvent(e){
    this.myNav.push(WelcomePage);
  }
}
