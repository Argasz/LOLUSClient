import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { WelcomePage } from "../welcome/welcome";
import { RegisterPage } from "../register/register";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    myNav: NavController;
    user: firebase.User;

    constructor(
        public navCtrl: NavController,
        private afAuth: AngularFireAuth,
        private gplus: GooglePlus
    ) {
        this.myNav = navCtrl;
        if(firebase.auth().currentUser) {
            this.signOut();
        }
    }


    signInWithFacebook() {
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
            this.user = user;
            this.navCtrl.push(TabsPage)
        });
    }

    async signInWithGoogle() {
      const gplusUser = await this.gplus.login({
        'webClientId': '1063142852475-e9m10q1g2l5o5kn98gavv9h6ebj7fiks.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
        this.afAuth.auth
        .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.webClientId))
        .then(user => {
            this.user = user.user;
            this.navCtrl.push(TabsPage)
        });
    }

    signOut() {
        this.afAuth.auth.signOut();
    }

    register() {
        this.myNav.push(RegisterPage);
    }

    clickEvent(e){
        this.myNav.push(WelcomePage);
    }
}
