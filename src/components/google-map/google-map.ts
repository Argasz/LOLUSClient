import { Component, ViewChild } from '@angular/core';
import { google } from 'google-maps';
import { Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'
import { Events } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { HmodalComponent } from "../hmodal/hmodal";
import {_} from 'underscore';

@Component({
    selector: 'google-map',
    templateUrl: 'google-map.html'
})

export class GoogleMapComponent {

    @ViewChild("map") mapElement;
    map: google.maps.Map;
    eventMarkers: Array<google.maps.Marker>;
    modalCtrl: ModalController;


    constructor(private platform: Platform, private geolocation: Geolocation, public events: Events, private modCtrl: ModalController) {
        let curLocation;
        this.eventMarkers = [];
        this.modalCtrl = modCtrl;
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
    /*events.subscribe('event:created', (title, time, clock, lat, lng) => {
    let latLng = new google.maps.LatLng(lat, lng);
    this.setMarker(latLng, title +'\nTid: ' + clock + ' Datum: ' + time );
});*/
events.subscribe('modal:open', (lat, lng) => {
    let latLng = new google.maps.LatLng(lat, lng);
    //this.setMarker(latLng, title);
    if(this.map){
    this.map.panTo(latLng);
}
});

events.subscribe('modal:close', ()=>{
    geolocation.getCurrentPosition().then(pos=>{
        this.map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    });
});

events.subscribe('updating:finished', ev => {
    for(let m in this.eventMarkers){
        this.eventMarkers[m].setMap(null);
    }
    this.eventMarkers = [];
    for(let e in ev){
        let latLng = new google.maps.LatLng(ev[e].lat, ev[e].lng);
        let marker: google.maps.Marker;

        if(ev[e].type === 'Okänd') {
            marker = new google.maps.Marker({position: latLng, title: ev[e].title+'\nTid: '+ev[e].time+
            '\nDatum: '+ev[e].date, map:this.map});
        } else {
            marker = new google.maps.Marker({position: latLng, title: ev[e].title+'\nTid: '+ev[e].time+
            '\nDatum: '+ev[e].date, map:this.map,label:ev[e].type.substr(0,1)});
        }

        let out = this;
        marker.addListener('click', function(){
            console.log('listen');
            let mod = out.modalCtrl.create(HmodalComponent,{title:ev[e].title, lat:ev[e].lat, lng:ev[e].lng,time:ev[e].time,date:ev[e].date,type:ev[e].type});
            mod.present();
        });
        this.eventMarkers.push(marker);
        //this.setMarker(latLng, ev[e].title + '\nTid:' + ev[e].time + '\nDatum: ' + ev[e].date, ev[e].type);
    }
})
}

initMap(latLng: google.maps.LatLng) {
    let coords = latLng;
    let mapOptions: google.maps.MapOptions = {
        center: coords,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.events.publish('map:init');
}


setMarker(latLng: google.maps.LatLng, title: string, type:string){
    let marker = new google.maps.Marker({position: latLng, title: title, map:this.map,label:type.substr(0,1)});
    this.eventMarkers.push(marker);
}


}
