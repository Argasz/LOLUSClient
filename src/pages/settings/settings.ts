import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsettingsPage } from '../notificationsettings/notificationsettings';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
	
	items = [
		'Notiser',
		'Test'
	];

	myNav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  this.myNav = navCtrl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  itemSelected(item: string){
	switch(item){
		case "Notiser":
			this.myNav.push(NotificationsettingsPage);
	}
	
  }

}
