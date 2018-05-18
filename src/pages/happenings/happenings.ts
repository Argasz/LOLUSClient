import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { HmodalComponent} from "../../components/hmodal/hmodal";
import { Geolocation } from '@ionic-native/geolocation'
import {_} from 'underscore'

/**
 * Generated class for the HändelserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-happenings',
  templateUrl: 'happenings.html',
})
export class HappeningsPage {
  ev: Array<happening>;
  events: Events;
  rest: RestProvider;
  avstand: number;
  latFactor: number;
  lngFactor: number;
  updating: boolean;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rests: RestProvider, public event: Events,
              public modCtrl: ModalController, public geolocation: Geolocation, public platform: Platform, public loadingCtrl: LoadingController) {
    this.events = event;
    this.rest = rests;
    this.ev = [];
    this.latFactor = 0.0090437; //Faktor för hur många latitudgrader som är en kilometer
    this.lngFactor = 0.017649; // Samma för longitud baserat på Stockholms latitud
    this.avstand = 1;
    setInterval(() => { //TODO: Uppdatera händelselista var 10:e sekund, ändra detta
      if (!this.updating) {
        this.getEvents(false);
      }
    }, 10000);

    this.events.subscribe('slider:change', (dist) => {
      this.avstand = dist;
      this.ev = [];
      this.getEvents(true);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
    this.getEvents(true);
  }

  presentLoading() { //TODO: Annan laddningsgrej för vanlig uppdatering
    this.loading = this.loadingCtrl.create({
      content: 'Laddar händelser inom ' + this.avstand + 'km...'
    });
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

  getEvents(presentLoad: boolean) {
    if (presentLoad) {
      this.presentLoading();
    }
    let lat: number;
    let lng: number;
    let startLat;
    let endLat;
    let startLng;
    let endLng;
    let date: Date;
    this.updating = true;
    this.platform.ready().then(() => {
        this.geolocation.getCurrentPosition().then(pos => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          startLat = lat - (this.avstand * this.latFactor);
          endLat = lat + (this.avstand * this.latFactor);
          startLng = lng - (this.avstand * this.lngFactor);
          endLng = lng + (this.avstand * this.lngFactor);

          this.rest.getEventsByLocation(startLat.toString(), endLat.toString(), startLng.toString(), endLng.toString()).subscribe(
            async (data) => {//TODO: ändra hur uppdateringen sker.
              for (let eventsKey in data) {
                let obj = data[eventsKey];
                date = new Date(Date.parse(obj.time));
                let found = await _.some(this.ev, function (x) {
                  return (x.lat === obj.lat) && (x.lng === obj.lng) && (x.date === date.toLocaleDateString()) && (x.time === date.toLocaleTimeString());
                });
                if (!found) {
                  await this.rest.reverseGeo(obj.lat, obj.lng).then(name => {
                    let nameObject = JSON.parse(JSON.stringify(name));
                    let title = nameObject.address.road + ' ' + nameObject.address.suburb;
                    let o: happening;
                    o = {
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
              if (presentLoad) {
                this.dismissLoading();
              }
              this.updating = false;
              //TODO: Sortera efter tid
              console.log("Updated");
            }, error => {
              console.log(error); //TODO: Presentera fel för användare?
              if (presentLoad) {
                this.dismissLoading();
              }
            });
        })
      }
    );


  }

  presentModal(title: string, lat: string, lng: string, time: string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, lat: lat, lng: lng, time: time});
    hModal.present();
  }
}

interface happening {
  title?: string;
  lat?: string;
  lng?: string;
  date?: string;
  time?: string;
}
