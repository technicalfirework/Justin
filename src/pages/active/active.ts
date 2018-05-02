import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation'
import { HomePage } from '../home/home';

@Component({
  selector: 'page-active',
  templateUrl: 'active.html'
})
export class ActivePage {
  startlong;
  startlat;
  currentLong;
  currentLat;
  error;
  constructor(public geoloc: Geolocation, public geofence: Geofence, public navCtrl: NavController, public navParams: NavParams) {
    this.startlong = this.navParams.get('longitude');
    this.startlat = this.navParams.get('latitude');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivePage');
  }

  removeFence() {
    this.geofence.removeAll();
    this.navCtrl.push(HomePage);
  }
  GetLocation() {
    this.geoloc.getCurrentPosition({
      enableHighAccuracy: true
    }).then((resp) => {
      alert(JSON.stringify(resp.coords.latitude));
      alert(JSON.stringify(resp.coords.longitude));
      this.currentLat = resp.coords.latitude;
      this.currentLong = resp.coords.longitude
    }).catch((error) => {
      this.error = JSON.stringify(error);
    });
  }
  CalculateDistance() {
    this.distance(this.startlat, this.startlong, this.currentLat, this.currentLong, 'K')
  }
  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 * 1000 }
    if (unit == "N") { dist = dist * 0.8684 }
    alert(dist);
  }
}