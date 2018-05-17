import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { WelcomePage } from "../welcome/welcome";
import { RegisterPage } from "../register/register";

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
        private afAuth: AngularFireAuth,
        private platform: Platform
    ) {
        this.myNav = navCtrl;
        if(firebase.auth().currentUser) {
            this.signOut();
        }
    }

    signInWithEmail(user: string, password: string) {
        firebase.auth()
        .signInWithEmailAndPassword(user, password)
        .then(user => {
            this.user = user;
            this.navCtrl.push(TabsPage)
        });
    }

    signInWithFacebook() {
        firebase.auth()
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
            this.user = user;
            this.navCtrl.push(TabsPage)
        });
    }

    signInWithGoogle() {
        firebase.auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(user => {
            this.user = user.user;
            this.navCtrl.push(TabsPage)
        });
    }

    signOut() {
        firebase.auth().signOut();
    }

    register() {
        this.myNav.push(RegisterPage);
    }

    clickEvent(e){
        this.myNav.push(WelcomePage);
    }
}
