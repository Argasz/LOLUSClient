import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WelcomePage } from "../welcome/welcome";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    myNav: NavController;
    user: firebase.User;

    constructor(
        public navCtrl: NavController,
        private afAuth: AngularFireAuth
    ) {
        this.myNav = navCtrl;
    }

    signInWithFacebook() {
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
            this.user = user
        });
        //console.log(this.user//.displayName);
    }

    signInWithGoogle() {
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(user => {
            this.user = user;
        });
        //console.log(this.user//.displayName);
    }

    signOut() {
        this.afAuth.auth.signOut();
    }

    clickEvent(e){
        this.myNav.push(WelcomePage);
    }
}
