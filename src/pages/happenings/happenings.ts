import {Component} from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { HmodalComponent} from "../../components/hmodal/hmodal";
import { Hmodal2Component} from "../../components/hmodal2/hmodal2";
import { Geolocation } from '@ionic-native/geolocation';
import {_} from 'underscore';
import * as firebase from 'firebase/app';

/**
 * Generated class for the HändelserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-happenings',
  templateUrl: 'happenings.html',
})
export class HappeningsPage {

  pev: Array<object>;
  ev: Array<happening>;
  events: Events;
  rest: RestProvider;
  currentSegment: object;
  avstand: number;
  latFactor: number;
  lngFactor: number;
  updating: boolean;
  loading: any;
  interrupt: boolean;
  icons: string;
  hasLoadedPoliceEvents: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rests: RestProvider, public event: Events,
              public modCtrl: ModalController, public geolocation: Geolocation, public platform: Platform, public loadingCtrl: LoadingController, public alertController: AlertController) {
    this.icons = 'locate';
    this.events = event;
    this.pev = [];
    this.rest = rests;
    this.ev = [];
    this.latFactor = 0.0090437; //Faktor för hur många latitudgrader som är en kilometer
    this.lngFactor = 0.017649; // Samma för longitud baserat på Stockholms latitud
    setInterval(() => {
      if (!this.updating && firebase.auth().currentUser) {
        this.getEvents(false);
      }
    }, 60000);

    this.events.subscribe('slider:change', async (dist) => {
      this.avstand = dist;
      if(!this.updating){
        this.ev = [];
        this.getEvents(true);
      }else{
        await this.interruptLoad();
        this.ev = [];
        this.getEvents(true);
      }
  });
    this.events.subscribe('vote:registered', async(lat, lng, time, date) =>{
      let out = this;
      if(!this.updating){
          this.ev = _.reject(this.ev, function(x){
            return x.lat === lat && x.lng === lng && x.time === time && x.date === date;

        });
          this.getEvents(false);
      }else{
        await new Promise(function(resolve){
          out.events.subscribe('updating:finished', ()=>{
            resolve('ok');
          })
        });
        this.ev = _.reject(this.ev, function(x){
          return x.lat === lat && x.lng === lng && x.time === time && x.date === date;

        });
        this.getEvents(false);
      }
    });
  this.events.subscribe('map:init', () => {
          this.events.publish('updating:finished', this.ev);
  });

    this.events.subscribe('user:signout', async ()=>{
      if(this.updating){
        await this.interruptLoad();
        this.ev = [];
      }
    });
  }

  interruptLoad(){
    let out = this;
    this.interrupt = true;
    return new Promise(function(resolve){
      out.events.subscribe('updating:interrupt', () =>{
          resolve('ok');
      });
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HändelserPage');
    this.getEvents(true);
  }

  presentLoading() {
  this.loading = this.loadingCtrl.create({
    enableBackdropDismiss: true,
  });
    switch(this.icons){
      case 'locate':
        if(this.avstand === null || typeof this.avstand === 'undefined'){
          this.avstand = 1;
        }
        this.loading.setContent('Laddar händelser inom ' + this.avstand + 'km...');
        break;
      case 'rss':
        this.loading.setContent('Laddar polisens händelser i Stockholm...');
        break;
      case 'facebook':
        this.loading.setContent('Laddar ingenting...');
        break;
    }
    this.loading.present();
  }

  selectedFriends() {
    this.icons = 'facebook';
    this.currentSegment = document.getElementById("friends");
  }

  selectedPolice() {
    this.icons = 'rss';
    this.getPoliceEvents();
  }



  async getPoliceEvents() {
    if(!this.hasLoadedPoliceEvents){
      this.presentLoading();
    }
      await this.rest.getPoliceEvents().toPromise().then(
        async(data) => {
          for(let event in data) {
            let o = data[event];
            let time = o.name.substring(0, o.name.indexOf(","));
            let name = o.name.substring(o.name.indexOf(",") + 2, o.name.lastIndexOf(","));
            let policeEvent = {
              'name' : name,
              'date' : time,
              'summary' : o.summary,
              'url': o.url
            };
            let found = await _.some(this.pev, function (x) {
              return (x.name === policeEvent.name) && (x.date === policeEvent.date);
            });
            if(!found){
              this.pev.push(policeEvent);
            }

          }
      });
    console.log("Polishändelser uppdaterade");
    this.dismissLoading();
    this.hasLoadedPoliceEvents = true;
  }


  presentAlert(error: any) {
    let alert = this.alertController.create({
      title: 'Fel vid hämtning av händelser',
      subTitle: error,
      buttons: ['Avfärda']
    });
    alert.present();
  }

  presentEmpty(){
    let alert = this.alertController.create({
      subTitle: 'Inga händelser inom ' + this.avstand + 'km hittade.',
      buttons: ['Avfärda']
    });
    alert.present();
  }

  dismissLoading() {
    if(this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  getEvents(presentLoad: boolean) {
    if (presentLoad) {
      this.presentLoading();
    }
    let startLat;
    let endLat;
    let startLng;
    let endLng;
    let date: Date;
    this.updating = true;
    this.events.publish('updating:started');
    this.platform.ready().then(() => {
        this.geolocation.getCurrentPosition().then(pos => {
          let lat: number;
          let lng: number;
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          startLat = lat - (this.avstand * this.latFactor);
          endLat = lat + (this.avstand * this.latFactor);
          startLng = lng - (this.avstand * this.lngFactor);
          endLng = lng + (this.avstand * this.lngFactor);

          this.rest.getEventsByLocation(startLat.toString(), endLat.toString(), startLng.toString(), endLng.toString()).toPromise().then(
            async (data) => {
              for (let eventsKey in data) {
                if (this.interrupt) {
                  break;
                }
                let obj = data[eventsKey];
                date = new Date(Date.parse(obj.time));
                let found = await _.some(this.ev, function (x) {
                  return (x.lat === obj.lat) && (x.lng === obj.lng) && (x.date === date.toLocaleDateString()) && (x.time === date.toLocaleTimeString());
                });
                if (!found) {
                  let title: string;
                  await this.rest.reverseGeo(obj.lat, obj.lng).toPromise().then((res)=>{
                      let result = JSON.parse(JSON.stringify(res));
                      if(result.results[0]){
                        let kort = result.results[0].formatted_address.split(',');
                        title = kort[0] +', ' + kort[1].slice(7);
                      }else{
                        console.log(res);
                        title = "Kunde inte hitta address";
                      }

                  }, rej =>{
                    console.log(rej.status);
                    title = "Kunde inte hitta address";
                  });
                  let o: happening;
                  let type: string;
                  let d = date.toLocaleDateString();
                  let t = date.toLocaleTimeString();
                  await this.rest.countVotes(obj.lat,obj.lng,d+'T'+t).toPromise().then(ret =>{
                    type = JSON.parse(JSON.stringify(ret)).type;
                  }, rej =>{
                    type = 'Okänd';
                  });
                  o = {
                    'title': title,
                    'lat': obj.lat,
                    'lng': obj.lng,
                    'date': d,
                    'time': t,
                    'type': type
                  };
                  if (!this.interrupt) {
                    this.ev.push(o);
                    this.events.publish('event:created', o.title, o.date, o.time, o.lat, o.lng);
                  }
                }
              }
              if(!this.interrupt){
                this.ev.sort(function(a,b){
                  return HappeningsPage.compareHappeningForSort(a, b);
                });
                if (presentLoad && this.loading) {
                  this.dismissLoading();
                  if(this.ev.length === 0){
                    this.presentEmpty();
                  }
                }
                this.updating = false;
                this.events.publish('updating:finished', this.ev);
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

  presentPoliceEvent(title: string, summary: string, url: string) {
    let hModal = this.modCtrl.create(Hmodal2Component, {title: title, summary: summary, url: url});
    hModal.present();
  }

  presentModal(title: string, lat: string, lng: string, time: string, date: string, type:string) {
    let hModal = this.modCtrl.create(HmodalComponent, {title: title, lat: lat, lng: lng, time: time,date: date,type:type});
    hModal.present();
  }

  static compareHappeningForSort(h1: happening, h2: happening){
    let date1 = Date.parse(h1.date);
    let date2 = Date.parse(h2.date);
    if(date1 > date2){
      return -1;
    }else if(date1 < date2){
      return 1;
    }
    let hr1 = parseInt(h1.time.substr(0,2));
    let hr2 = parseInt(h2.time.substr(0,2));
    if(hr1 > hr2){
      return -1;
    }else if(hr1 < hr2){
      return 1;
    }
    let min1 = parseInt(h1.time.substr(3,2));
    let min2 = parseInt(h2.time.substr(3,2));
    if(min1 > min2){
      return -1;
    }else if(min1 < min2){
      return 1;
    }
    let sec1 = parseInt(h1.time.substr(6,2));
    let sec2 = parseInt(h2.time.substr(6, 2));
    if(sec1 > sec2){
      return -1;
    }else if(sec1 < sec2){
      return 1;
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
  type?: string;
}
