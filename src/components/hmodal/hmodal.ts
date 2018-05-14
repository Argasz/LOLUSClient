import { Component } from '@angular/core';
import {NavParams, Events, ViewController} from 'ionic-angular';


/**
 * Generated class for the HmodalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'hmodal',
  templateUrl: 'hmodal.html'
})

export class HmodalComponent {
  lng: string;
  lat: string;
  time: string;
  event: any;
  title: string;
  viewCtrl: ViewController;
  constructor(params: NavParams, events: Events, viewCtrl: ViewController) {
    this.lat = params.get('lat');
    this.lng = params.get('lng');
    this.title = params.get('title');
    this.time = params.get('time');
    this.event = events;
    this.viewCtrl = viewCtrl;
  }

  ionViewDidLoad(){
    this.event.subscribe('map:init', ()=>{
      this.event.publish('modal:open', this.lat, this.lng, this.title);
    });

  }
  dismiss(){
    this.event.publish('modal:close');
    this.viewCtrl.dismiss();
  }
}
