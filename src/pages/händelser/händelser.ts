import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';

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
  ev: JSON;
  events: Events;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public event: Events) {
    this.events = event;
    this.getEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
  }

  getEvents() {
    this.rest.getAllEvents().subscribe(
      data => {
        this.ev = data;
        for (let eventsKey in this.ev) {
            let obj = this.ev[eventsKey];
            this.events.publish('event:created',obj.time, obj.lat, obj.lng);
        }
      }
    )
  }

  doRefresh(refresher){
    this.getEvents();
    console.log("Done");
    refresher.complete();
  }

}
