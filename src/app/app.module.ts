import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { KartaPage } from "../pages/karta/karta";
import { HändelserPage } from "../pages/händelser/händelser";
import { WelcomePage } from "../pages/welcome/welcome";
import { SettingsPage } from "../pages/settings/settings";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { RestProvider } from "../providers/rest/rest";
import { GoogleMapComponent } from '../components/google-map/google-map';
import { Geolocation } from '@ionic-native/geolocation';
import { HmodalComponent } from "../components/hmodal/hmodal";
import { NotificationsettingsPage } from "../pages/notificationsettings/notificationsettings";



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    KartaPage,
    HändelserPage,
	  WelcomePage,
    SettingsPage,
    GoogleMapComponent,
    HmodalComponent,
	NotificationsettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    KartaPage,
    HändelserPage,
	  WelcomePage,
    SettingsPage,
    HmodalComponent,
	NotificationsettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestProvider,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
