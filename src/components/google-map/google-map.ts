import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})

export class GoogleMapComponent {

    @ViewChild("map") mapElement;
     map: any;

  constructor() {

  }

  ngOnInit() {
      this.initMap();
      this.getMarker();
  }

  initMap() {

      let coords = new google.maps.LatLng(59.329357,18.068644);
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

}
