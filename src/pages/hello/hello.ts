import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { helloProvider } from "../../providers/hello-prov/hello-prov";
import {Observer} from 'rxjs/Observer';

/**
 * Generated class for the HelloPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hello',
  templateUrl: 'hello.html',
  providers: [helloProvider]
})
export class HelloPage {
  greetingObs: Observer<string>;
  greeting: string;

  constructor(public navCtrl: NavController, public navParam: NavParams, public HelloProvider: helloProvider) {
    this.greeting = this.greetingObs.toString();
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HelloPage');
  }

}
