import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { HmodalComponent} from "../../components/hmodal/hmodal";
import { Geolocation } from '@ionic-native/geolocation'
import {_} from 'underscore'

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
  ev: Array<object>;
  events: Events;
  rest: RestProvider;
  avstand: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rests: RestProvider, public event: Events,
              public modCtrl: ModalController, public geolocation: Geolocation, public platform: Platform) {
    this.events = event;
    this.rest  = rests;
    this.ev = new Array<object>();
    this.avstand = 0.0065;
    setInterval(() => { //Uppdatera händelselista var 10:e sekund
      this.getEvents();
      }, 10000);

    this.events.subscribe('slider:change', (avstand) =>{
        this.avstand = 0.0065*avstand;
        this.ev = new Array<object>();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
    this.getEvents();
  }

  getEvents() {
    let lat: number;
    let lng: number;
    let startLat;
    let endLat;
    let startLng;
    let endLng;
    let date: Date;
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(pos => {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        startLat = lat-this.avstand;
        endLat = lat+this.avstand;
        startLng = lng-this.avstand; //TODO: Bind detta till settings-slider
        endLng = lng+this.avstand;

        this.rest.getEventsByLocation(startLat.toString(), endLat.toString(),startLng.toString(),endLng.toString()).subscribe(
          async (data) => {//TODO: ändra hur uppdateringen sker.
            for (let eventsKey in data) {
              let obj = data[eventsKey];
              date = new Date(Date.parse(obj.time));
              let found = await _.some(this.ev, function (x){
                return (x.lat === obj.lat) && (x.lng === obj.lng) && (x.date === date.toLocaleDateString()) && (x.time === date.toLocaleTimeString());
              });
              if(!found) {
                await this.rest.reverseGeo(obj.lat, obj.lng).then(name => {
                  let nameObject = JSON.parse(JSON.stringify(name));
                  let title = nameObject.address.road + ' ' + nameObject.address.suburb;
                  let o = {
                    'title': title,
                    'lat': obj.lat,
                    'lng': obj.lng,
                    'date': date.toLocaleDateString(),
                    'time': date.toLocaleTimeString()
                  };
                  this.ev.push(o);
                  this.events.publish('event:created', o.title, o.date, o.time, o.lat, o.lng);
                });
              }
            }
          }
        )
        console.log("Updated");
      })
      }
    );


  }

  presentModal(title: string, lat: string, lng: string, time: string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, lat: lat, lng: lng,time: time}); //TODO: Fixa modaldisplay för nytt stringformat
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
