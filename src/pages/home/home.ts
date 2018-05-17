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

    signInWithFacebook() {
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
            this.user = user;
            this.navCtrl.push(TabsPage)
        });
    }

    signInWithGoogle() {
        if(!this.platform.is('ios') || !this.platform.is('android')) {
            this.afAuth.auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(user => {
                this.user = user.user;
                this.navCtrl.push(TabsPage)
            });
        } else {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function() {
                return firebase.auth().getRedirectResult();
            }).then(function(result) {
                // This gives you a Google Access Token.
                // You can use it to access the Google API.
                //var token = result.credential.accessToken;
                // The signed-in user info.
                //var user = result.user;
                // ...
                console.log("SUCCESS");
            }).catch(function(error) {
            // Handle Errors here.
            //var errorCode = error.code;
            //var errorMessage = error.message;
            console.log("Code is broken");
        });
    }
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
