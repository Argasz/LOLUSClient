import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { WelcomePage } from "../welcome/welcome";
import { RegisterPage } from "../register/register";

import { GooglePlus } from '@ionic-native/google-plus'
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
        private platform: Platform,
        private gplus: GooglePlus
    ) {
    let out = this;
      firebase.auth().onAuthStateChanged(user =>{
        if(firebase.auth().currentUser){
          this.user = firebase.auth().currentUser;
          console.log(user);
          out.navCtrl.push(TabsPage);
        }
      })
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
        }, error => {
          console.log(error);
        });
    }

     signInWithGoogle() {
          this.platform.ready().then(()=>{
            if(this.platform.is('cordova')){
              this.nativeGoogleSignIn();
            }else{
               this.webGoogleSignIn();
            }
          },
              onerror =>{
            console.log(onerror);
          });
    }

    nativeGoogleSignIn(){
      try{
        this.gplus.login({'webClientId':'1063142852475-e9m10q1g2l5o5kn98gavv9h6ebj7fiks.apps.googleusercontent.com'}).then( (gplusUser) =>{
          console.error("NATIVE");
          console.log(firebase.auth.GoogleAuthProvider.credential(gplusUser.tokenId));
          return this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
        }, onerror => {
          console.error(onerror);
        });

      } catch(err){
        console.log(err);
      }
    }


    webGoogleSignIn(){
      firebase.auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    signOut() {
        firebase.auth().signOut();
    }

    register() {
        this.navCtrl.push(RegisterPage);
    }

    clickEvent(e){
        this.navCtrl.push(WelcomePage);
    }
}
