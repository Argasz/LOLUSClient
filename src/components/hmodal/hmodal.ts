import { Component } from '@angular/core';
import {NavParams, Events} from 'ionic-angular';


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
  constructor(params: NavParams, events: Events) {
    this.lat = params.get('lat')
    this.lng = params.get('lng')
    this.title = params.get('title');
    this.time = params.get('time');
    this.event = events;
  }

  ionViewDidLoad(){
    this.event.subscribe('map:init', ()=>{
      this.event.publish('modal:open', this.lat, this.lng ); //TODO: zooma tillbaka onclose
    });

  }
}
