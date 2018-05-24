import { Component, ViewChild } from '@angular/core';
import { google } from 'google-maps';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'
import { Events } from 'ionic-angular';
import * as firebase from 'firebase/app';

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})

export class GoogleMapComponent {

    @ViewChild("map") mapElement;
     map: any;

  constructor(private platform: Platform, private geolocation: Geolocation, public events: Events) {
    let curLocation;
    platform.ready().then(async () => {
      await geolocation.getCurrentPosition().then(pos =>{
        let ic = {
          scaledSize: new google.maps.Size(25,25),
          url: firebase.auth().currentUser.photoURL
        };
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.initMap(latLng);
      curLocation = new google.maps.Marker({
          map: this.map,
          position: latLng,
          icon: ic
        });

      });
        geolocation.watchPosition().subscribe(pos =>{

          let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          curLocation.setPosition(latLng);
        });
      }
    );
    events.subscribe('event:created', (title, time, clock, lat, lng) => {
        let latLng = new google.maps.LatLng(lat, lng);
        this.setMarker(latLng, title +'\nTid: ' + clock + ' Datum: ' + time );
    });
    events.subscribe('modal:open', (lat, lng, title) => {
      let latLng = new google.maps.LatLng(lat, lng);
      this.setMarker(latLng, title);
      this.map.panTo(latLng);
    });

    events.subscribe('modal:close', ()=>{
      geolocation.getCurrentPosition().then(pos=>{
        this.map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      })
    });
  }

  initMap(latLng: google.maps.LatLng) {
      let coords = latLng;
      let mapOptions: google.maps.MapOptions = {
          center: coords,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.events.publish('map:init');
  }


  setMarker(latLng: google.maps.LatLng, title: string){
    let marker = new google.maps.Marker({position: latLng, title: title});
    marker.setMap(this.map);
  }


}
