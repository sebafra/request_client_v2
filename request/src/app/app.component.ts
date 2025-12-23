import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Constants } from './app.constants';
import { ContactPage } from '../pages/contact/contact';
import { SettingsPage } from '../pages/settings/settings';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  @ViewChild('myNav') nav: NavController

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private ga: GoogleAnalytics,
    app: App
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initAnalytics();
      statusBar.styleDefault();
      splashScreen.hide();
      let ip = localStorage.getItem("REQUEST_IP");
      let combo_complete = localStorage.getItem("REQUEST_COMBO_COMPLETE");
      if (combo_complete) {
        Constants.COMBO_COMPLETE = combo_complete;
      }
      console.log(Constants.COMBO_COMPLETE);
      console.log(ip);
      if (ip) {
        Constants.API_BASE_URL = "http://" + ip + ":3076/api";
      } else {
        this.nav.push(SettingsPage);
      }
    });
  }
  initAnalytics() {
    this.ga.startTrackerWithId('UA-138668159-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('Init');
        this.ga.setAppVersion(Constants.APP_VERSION);
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }
}
