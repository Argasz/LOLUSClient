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
  constructor(params: NavParams, events: Events) {
    this.lat = params.get('lat')
    this.lng = params.get('lng')
    this.time = params.get('title');
    this.event = events;
  }

  ionViewDidLoad(){
    setTimeout(()=>{
      this.event.publish('modal:open', this.lat, this.lng ); //TODO: Ska reagera på att karta är laddad,
    }, 2000)

  }
}
