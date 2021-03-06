import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { KartaPage } from "../pages/karta/karta";
import { HappeningsPage } from "../pages/happenings/happenings";
import { WelcomePage } from "../pages/welcome/welcome";
import { SettingsPage } from "../pages/settings/settings";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { RestProvider } from "../providers/rest/rest";
import { GoogleMapComponent } from '../components/google-map/google-map';
import { Geolocation } from '@ionic-native/geolocation';
import { HmodalComponent } from "../components/hmodal/hmodal";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Hmodal2Component} from "../components/hmodal2/hmodal2";
import { VoteComponent } from "../components/vote/vote";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { HTTP } from '@ionic-native/http';

export const firebaseConfig = {
    apiKey: "AIzaSyDCBpUvRzqrAA5rtpvKsQWgXUt22RiDqr4",
    authDomain: "lolus-201915.firebaseapp.com",
    databaseURL: "https://lolus-201915.firebaseio.com",
    projectId: "lolus-201915",
    storageBucket: "lolus-201915.appspot.com",
    messagingSenderId: "1063142852475"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    RegisterPage,
    TabsPage,
    KartaPage,
    HappeningsPage,
	  WelcomePage,
    SettingsPage,
    GoogleMapComponent,
    HmodalComponent,
    Hmodal2Component,
    VoteComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    TabsPage,
    KartaPage,
    HappeningsPage,
	  WelcomePage,
    SettingsPage,
    HmodalComponent,
    Hmodal2Component,
    GoogleMapComponent,
    VoteComponent
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    RestProvider,
    Geolocation,
    GooglePlus,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
