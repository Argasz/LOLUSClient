import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';

/*
Generated class for the RestProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class RestProvider {

  private apiUrl = 'http://localhost:8080';
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
    return this.http.get<JSON>(this.apiUrl + "/getPolice" + '?locationName=Stockholm');
  }

  getEventsByLocation(startLat: string, endLat: string, startLng: string, endLng: string) {
      console.log(this.apiUrl + '/getEventsByLocation?startLat=' + startLat + '&endLat=' + endLat + '&startLng=' + startLng + '&endLng=' + endLng);
      return this.http.get<JSON>(this.apiUrl + '/getEventsByLocation?startLat=' + startLat + '&endLat=' + endLat + '&startLng=' + startLng + '&endLng=' + endLng);
  }

  reverseGeo(lat: string, lng: string){
    return this.http.get<JSON>(this.googleRevUrl+'latlng=' + lat + ',' + lng+'&key='+this.geoApiKey);
  }

  addVote(lat: string, lng: string, time: string, type:string){
      let userToken = firebase.auth().currentUser.uid;
      return this.http.get(this.apiUrl+'/addVote?type='+type+'&userToken='+userToken+'&eventTime='+time+'&eventLat='+lat+'&eventLng='+lng);
  }

  countVotes(lat: string, lng:string, time:string){
      return this.http.get<JSON>(this.apiUrl+'/countVotes?eventTime='+time+'&eventLat='+lat+'&eventLng='+lng);
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
