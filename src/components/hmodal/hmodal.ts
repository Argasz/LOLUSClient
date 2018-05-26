import { Component } from '@angular/core';
import {NavParams, Events, ViewController, ModalController} from 'ionic-angular';
import {VoteComponent} from "../vote/vote";


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
  date: string;
  event: any;
  title: string;
  type: string;
  viewCtrl: ViewController;
  private modCtrl: ModalController;
  constructor(params: NavParams, events: Events, viewCtrl: ViewController, modCtrl: ModalController) {
    this.lat = params.get('lat');
    this.lng = params.get('lng');
    this.title = params.get('title');
    this.time = params.get('time');
    this.date = params.get('date');
    this.event = events;
    this.type = params.get('type');
    this.viewCtrl = viewCtrl;
    this.modCtrl = modCtrl;
  }

  ionViewDidLoad(){
    this.event.subscribe('map:init', ()=>{
      this.event.publish('modal:open', this.lat, this.lng, this.title);
    });

  }

  vote(){
    let voteModal = this.modCtrl.create(VoteComponent, {lat: this.lat, lng: this.lng, time: this.time, date: this.date});
    voteModal.present();
  }

  dismiss(){
    this.event.publish('modal:close');
    this.viewCtrl.dismiss();
  }
}
