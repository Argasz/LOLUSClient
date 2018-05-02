import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import { google } from "google-maps";
/**
 * Generated class for the Welcome1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
	
  @ViewChild(Slides) slides: Slides;

  myNav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	this.myNav = navCtrl;
  }
	
  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }


  nextSlide() {
	this.slides.slideNext();
  }
  
  skipIntro() {
	this.myNav.push(TabsPage);
  }
  
  endIntro() {
	this.myNav.push(TabsPage);
  }
 

}
