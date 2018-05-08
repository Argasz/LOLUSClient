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
    let ready = false;
    platform.ready().then(() => {
      geolocation.getCurrentPosition().then( pos=>{
        this.initMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        )
      }
    );
    events.subscribe('event:created', (time, lat, lng) => {
        let latLng = new google.maps.LatLng(lat, lng);
        this.setMarker(latLng, time);
    });
    events.subscribe('modal:open', (lat, lng) => {
      let latLng = new google.maps.LatLng(lat, lng);
      this.map.panTo(latLng);
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
  }

  getMarker() {
      var position = new google.maps.LatLng(59.329357,18.068644);
      var lamp = new google.maps.Marker({position: position, title: "test"});
      lamp.setMap(this.map);
      var position2 = new google.maps.LatLng(59.329340,18.068630);
      var lamp2 = new google.maps.Marker({position: position2, title: "test2"});
      lamp2.setMap(this.map);
  }

  setMarker(latLng: google.maps.LatLng, time: string){
    let marker = new google.maps.Marker({position: latLng, title: time});
    marker.setMap(this.map);
  }


}
