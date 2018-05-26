import { Component } from '@angular/core';
import {ViewController, NavParams, Events} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the VoteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'vote',
  templateUrl: 'vote.html'
})
export class VoteComponent {

  viewCtrl: ViewController;
  rest: RestProvider;
  lat: string;
  lng: string;
  time: string;
  date : string;
  returnVal: any;
  events: Events;

  constructor(viewCtrl:ViewController, rest: RestProvider, params: NavParams, events: Events) {
    this.viewCtrl = viewCtrl;
    this.rest = rest;
    this.lat = params.get('lat');
    this.lng = params.get('lng');
    this.time = params.get('time');
    this.date = params.get('date');
    this.events = events;

  }

  async vote(type: string){
    let dateTime = this.date +'T'+ this.time;
    console.log(dateTime);
    let rets:any;
    await this.rest.addVote(this.lat,this.lng,dateTime,type).toPromise().then(ret =>{
      console.log(ret);
      rets = ret;
    });

    if(rets.return === 'Vote saved'){
      this.events.publish('vote:registered', this.lat, this.lng, this.time, this.date);
    }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
