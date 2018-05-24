import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
Generated class for the RestProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class RestProvider {
  private policeUrl = 'http://localhost:8100/api/events';
  private apiUrl = 'https://LOLUS-dev.eu-west-1.elasticbeanstalk.com';
  private googleRevUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
  private geoApiKey = 'AIzaSyDM4lF22az4fKhqSGbsbUS0gYyCjdLgzqo';

    constructor(public http: HttpClient) {
        //console.log('Hello RestServiceProvider Provider');
    }

    getAllEvents() {
    return this.http.get<JSON>(this.apiUrl + '/getAllEvents')
    }

    getEventsByTime(start: string, end: string) {

    }

  getPoliceEvents() {
    return this.http.get<JSON>(this.policeUrl + '?locationName=Stockholm');
  }

  getEventsByLocation(startLat: string, endLat: string, startLng: string, endLng: string) {
      console.log(this.apiUrl + '/getEventsByLocation?startLat=' + startLat + '&endLat=' + endLat + '&startLng=' + startLng + '&endLng=' + endLng);
      return this.http.get<JSON>(this.apiUrl + '/getEventsByLocation?startLat=' + startLat + '&endLat=' + endLat + '&startLng=' + startLng + '&endLng=' + endLng);
  }

  reverseGeo(lat: string, lng: string){
    return this.http.get<JSON>(this.googleRevUrl+'latlng=' + lat + ',' + lng+'&key='+this.geoApiKey);
  }
}

/*outerThis.geoCoder.geocode({'location': new google.maps.LatLng(parseFloat(lat), parseFloat(lng))}, function (results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    let res: google.maps.GeocoderResult;
    res = results[0];
    resolve(res.formatted_address);
  } else {
    console.log(status);
    reject("Adress ej hittad");
  }
});*/
