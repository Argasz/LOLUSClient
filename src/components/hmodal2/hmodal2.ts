import { Component } from '@angular/core';
import {Events, NavParams, ViewController} from "ionic-angular";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the Hmodal2Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'hmodal2',
  templateUrl: 'hmodal2.html'
})
export class Hmodal2Component {
  title: string;
  summary: string;
  date: string;
  url: string;
  event: any;
  iab: InAppBrowser;
  viewCtrl: ViewController;

  constructor(params: NavParams, events: Events, viewCtrl: ViewController, iab: InAppBrowser) {
    this.title = params.get('title');
    this.summary = params.get('summary');
    this.url = params.get('url');
    this.date = params.get('date');
    this.event = events;
    this.viewCtrl = viewCtrl;
    this.iab = iab;
  }

  openLink(url: string){
    const browser = this.iab.create(url);
  }

  dismiss() {
    this.event.publish('modal:close');
    this.viewCtrl.dismiss();
  }
}
