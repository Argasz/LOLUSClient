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
  private geoApiKey = '92e6a7c5bbd4df';

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

  reverseGeo(lat: string, lng: string) {
    let outerThis = this;
    return new Promise(resolve => {
      setTimeout(function(){
        outerThis.http.get<JSON>('https://eu1.locationiq.org/v1/reverse.php?key=' + outerThis.geoApiKey + '&lat=' + lat + '&lon=' + lng + '&countrycodes=se' + '&format=json').subscribe(data => {
          resolve(data);
        });
      }, 1000);
    });
  }
}
