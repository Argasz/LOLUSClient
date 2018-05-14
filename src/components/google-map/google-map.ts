import { Component, ViewChild } from '@angular/core';
import { google } from 'google-maps';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'
import { Events } from 'ionic-angular';

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})

export class GoogleMapComponent {

    @ViewChild("map") mapElement;
     map: any;

  constructor(private platform: Platform, private geolocation: Geolocation, public events: Events) {
    platform.ready().then(() => {
      geolocation.getCurrentPosition().then( pos=>{
        this.initMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        )
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
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
      this.events.publish('map:init');
  }

  getMarker() {
      var position = new google.maps.LatLng(59.329357,18.068644);
      var lamp = new google.maps.Marker({position: position, title: "test"});
      lamp.setMap(this.map);
      var position2 = new google.maps.LatLng(59.329340,18.068630);
      var lamp2 = new google.maps.Marker({position: position2, title: "test2"});
      lamp2.setMap(this.map);
  }

  setMarker(latLng: google.maps.LatLng, title: string){
    let marker = new google.maps.Marker({position: latLng, title: title});
    marker.setMap(this.map);
  }


}
