import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation'
import { ActivePage } from '../active/active';
//import { ActivePage } from '../active/active';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  radius: number = 100;
  error: any;
  success: any;
  latitude;
  longitude;
  loader;
  constructor(public geoloc: Geolocation, public geofence: Geofence, public navCtrl: NavController, private platform: Platform, public loading: LoadingController) {
    this.platform.ready().then(() => {
      this.presentLoadingDefault('Initializing')
      this.geofence.initialize().then(
        () => console.log('Geofence Plugin Ready'),
        (err) => console.log(err)
      );
      this.geoloc.getCurrentPosition({
        enableHighAccuracy: true
      }).then((resp) => {
        this.loader.dismiss();
        alert(JSON.stringify(resp.coords.latitude));
        alert(JSON.stringify(resp.coords.longitude));
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude
      }).catch((error) => {
        this.error = JSON.stringify(error);
      });
    });
  }
  presentLoadingDefault(text) {
    this.loader = this.loading.create({
      content: text
    });
    this.loader.present();
  }
  GetLocation() {
    this.geofence.getWatched().then(data => {
      alert(JSON.stringify(data));
      this.navCtrl.push(ActivePage, { longitude: this.longitude, latitude: this.latitude });
    });
  }
  setGeofence(value: number) {
    this.presentLoadingDefault('Setting Fense')
    this.geoloc.getCurrentPosition({
      enableHighAccuracy: true
    }).then((resp) => {
      var radius = value;
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      let fence = {
        id: new Date().getUTCMilliseconds(),
        latitude: this.latitude,
        longitude: this.longitude,
        radius: radius,
        transitionType: 2,
        notification: { //notification settings
          id: new Date().getUTCMilliseconds(), //any unique ID
          title: 'You crossed a fence', //notification title
          text: 'You just arrived to city center.', //notification body
          openAppOnClick: true //open app when notification is tapped
        }
      }

      this.geofence.addOrUpdate(fence).then(
        () => {
          alert('fence added')
          this.loader.dismiss()
        },
        (err) => this.error = "Failed to add or update the fence."
      );

      this.geofence.onTransitionReceived().subscribe(resp => {
        // this.latitude = resp.coords.latitude;
        // this.longitude = resp.coords.longitude
        this.error = this.latitude + ' , ' + resp.coords.latitude + ',' + resp.coords.longitude + ' , I am outside'
        // alert(this.latitude + ' , ' + resp.coords.latitude + ' , I am outside');
        // alert(this.longitude + ' , ' + resp.coords.longitude + ' , I am outside');
        // SMS.send('5555555555', 'OMG She lied, leave her now!');
      });
      // this.navCtrl.push(ActivePage, { longitude: this.longitude, latitude: this.latitude });
    }).catch((error) => {
      this.error = JSON.stringify(error);
    });
  }
}
