import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { HmodalComponent} from "../../components/hmodal/hmodal";

//import { google } from 'google-maps';

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
  rest: RestProvider;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rests: RestProvider, public event: Events, public modCtrl: ModalController) {
    this.events = event;
    this.rest  = rests;
    setInterval(() => { //Uppdatera händelselista var 10:e sekund
      this.getEvents();
      }, 10000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
    this.getEvents();
  }

  getEvents() {
    this.rest.getAllEvents().subscribe(
      data => {
        this.ev = data;
        for (let eventsKey in this.ev) {
            let obj = this.ev[eventsKey];
            //this.ev[eventsKey].placeName = this.revGeoCode(new google.maps.LatLng(obj.lat, obj.lng)); behövs licens?
            this.events.publish('event:created',obj.time, obj.lat, obj.lng);
        }
      }
    )
    console.log("Updated");
  }

  presentModal(title: string, lat: string, lng: string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, lat: lat, lng: lng});
    hModal.present();
  }
  /*revGeoCode(latLng: google.maps.LatLng){
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latLng}, function(results, status){
      if(status === google.maps.GeocoderStatus.OK){
        if(results[0]){
          return(results[0].formatted_address);
        }else{
          console.log("Inga resultat.");
        }
      }else{
        console.log("Geocode failed due to: " + status);
      }
    })
  }*/


}
