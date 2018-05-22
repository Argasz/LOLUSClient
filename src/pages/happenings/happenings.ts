import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { HmodalComponent} from "../../components/hmodal/hmodal";
import { Geolocation } from '@ionic-native/geolocation';
import {_} from 'underscore';

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

  pev: Array<object>;
  ev: Array<happening>;
  events: Events;
  rest: RestProvider;
  avstand: number;
  latFactor: number;
  lngFactor: number;
  updating: boolean;
  loading: any;
  interrupt: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rests: RestProvider, public event: Events,
              public modCtrl: ModalController, public geolocation: Geolocation, public platform: Platform, public loadingCtrl: LoadingController, public alertController: AlertController) {
    this.events = event;
    this.pev = new Array<object>();
    this.rest = rests;
    this.ev = [];
    this.latFactor = 0.0090437; //Faktor för hur många latitudgrader som är en kilometer
    this.lngFactor = 0.017649; // Samma för longitud baserat på Stockholms latitud
    setInterval(() => { //TODO: Uppdatera händelselista var 10:e sekund, ändra detta?
      if (!this.updating) {
        this.getEvents(false);
      }
    }, 10000);

    this.events.subscribe('slider:change', async (dist) => {
      this.avstand = dist;
      if(!this.updating){
        this.getEvents(true);
      }else{
        await this.interruptLoad();
        this.ev = [];
        this.getEvents(true);
      }
    });
  }

  interruptLoad(){
    let out = this;
    this.interrupt = true;
    return new Promise(function(resolve){
      out.events.subscribe('updating:interrupt', () =>{
          resolve('ok');
      })
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
    this.getEvents(true);
  }

  presentLoading() {
    if(this.avstand === null || typeof this.avstand === 'undefined'){
      this.avstand = 1;
    }
    this.loading = this.loadingCtrl.create({
      enableBackdropDismiss: true,
      content: 'Laddar händelser inom ' + this.avstand + 'km...'
    });
    this.loading.present();
  }

  selectedLocal() {
    document.getElementById("friends").style.visibility = "hidden";
    document.getElementById("local").style.visibility = "visible";
    document.getElementById("police").style.visibility = "hidden";
    this.getEvents();
  }

  selectedFriends() {

  }

  selectedPolice() {
    document.getElementById("friends").style.visibility = "hidden";
    document.getElementById("local").style.visibility = "hidden";
    document.getElementById("police").style.visibility = "visible";
    this.getPoliceEvents();
  }



  getPoliceEvents() {
    let date: Date;
    this.platform.ready().then( () => {
      this.rest.getPoliceEvents().subscribe(
        async(data) => {
          for(let event in data) {
            let o = data[event];
            date = new Date(Date.parse(o.time));
            let policeevent = {
              'name' : o.name,
              'date' : date.toLocaleDateString(),
              'summary' : o.summary
            }
            this.pev.push(policeevent);
            this.events.publish(o.name);
            console.log(o.name);
          }
      }
    )});
  }


  presentAlert(error: any) {
    let alert = this.alertController.create({
      title: 'Fel vid hämtning av händelser',
      subTitle: error,
      buttons: ['Avfärda']
    });
    alert.present();
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
    this.events.publish('updating:started');
    this.platform.ready().then(() => {
        this.geolocation.getCurrentPosition().then(pos => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          startLat = lat - (this.avstand * this.latFactor);
          endLat = lat + (this.avstand * this.latFactor);
          startLng = lng - (this.avstand * this.lngFactor);
          endLng = lng + (this.avstand * this.lngFactor);

          this.rest.getEventsByLocation(startLat.toString(), endLat.toString(), startLng.toString(), endLng.toString()).subscribe(
            async (data) => {//TODO: ändra hur uppdateringen sker?
              for (let eventsKey in data) {
                if(this.interrupt){
                  break;
                }
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
                    if(!this.interrupt){
                      this.ev.push(o);
                      this.events.publish('event:created', o.title, o.date, o.time, o.lat, o.lng);
                    }
                  });
                }
              }
              if(!this.interrupt){
                this.ev.sort(function(a,b){
                  return HappeningsPage.compareHappeningForSort(a, b);
                });
                if (presentLoad && this.loading) {
                  this.dismissLoading();
                }
                this.updating = false;
                this.events.publish('updating:finished');
                console.log("Updated");
              }else{
                if(presentLoad && this.loading){
                  this.dismissLoading();
                }
                this.updating = false;
                this.interrupt = false;
                this.events.publish('updating:interrupt');
              }

            }, error => {
              console.log(error); //TODO: Presentera fel för användare?
              if (presentLoad && this.loading) {
                this.dismissLoading();
              }
              this.presentAlert(error);
            });
        });
      }
    );
  }

  presentPoliceEvent(title: string, summary: string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, summary: summary}); //TODO: Fixa modaldisplay för nytt stringformat
    hModal.present();
  }

  presentModal(title: string, lat: string, lng: string, time: string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, lat: lat, lng: lng, time: time});
    hModal.present();
  }

  static compareHappeningForSort(h1: happening, h2: happening){
    let date1 = Date.parse(h1.date);
    let date2 = Date.parse(h2.date);
    if(date1 > date2){
      return 1;
    }else if(date1 < date2){
      return -1;
    }
    let hr1 = parseInt(h1.time.substr(0,2));
    let hr2 = parseInt(h2.time.substr(0,2));
    if(hr1 > hr2){
      return 1;
    }else if(hr1 < hr2){
      return -1;
    }
    let min1 = parseInt(h1.time.substr(3,2));
    let min2 = parseInt(h2.time.substr(3,2));
    if(min1 > min2){
      return 1;
    }else if(min1 < min2){
      return -1;
    }
    let sec1 = parseInt(h1.time.substr(6,2));
    let sec2 = parseInt(h2.time.substr(6, 2));
    if(sec1 > sec2){
      return 1;
    }else if(sec1 < sec2){
      return -1;
    }else{
      return 0;
    }
  }
}

interface happening {
  title?: string;
  lat?: string;
  lng?: string;
  date?: string;
  time?: string;
}
