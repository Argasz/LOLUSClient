import { Component } from '@angular/core';
import {Events, NavParams, ViewController} from "ionic-angular";

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
  event: any;
  viewCtrl: ViewController;

  constructor(params: NavParams, events: Events, viewCtrl: ViewController) {
    this.title = params.get('title');
    this.summary = params.get('summary');
    this.event = events;
    this.viewCtrl = viewCtrl;
  }

  dismiss() {
    this.event.publish('modal:close');
    this.viewCtrl.dismiss();
  }
}

