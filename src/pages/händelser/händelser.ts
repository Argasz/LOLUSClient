import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";

/**
 * Generated class for the HändelserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-händelser',
  templateUrl: 'händelser.html',
})
export class HändelserPage {
  events: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.getEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
  }

  getEvents() {
    this.rest.getAllEvents().then(
      data => {
        this.events = data;
      }
    )
  }

  doRefresh(refresher){

    this.getEvents();
    console.log("Done")
    refresher.complete();
  }

}
