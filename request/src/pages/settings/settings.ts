import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Constants } from '../../app/app.constants';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  ip: string;
  currentIp: string = "Cargando..";
  comboComplete: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController
    ) {
    let currentIP = localStorage.getItem("REQUEST_IP");
    if (currentIP && currentIP != "undefined") {
      this.currentIp = currentIP; 
    } else {
      this.currentIp = '';
    }
    this.comboComplete = localStorage.getItem("REQUEST_COMBO_COMPLETE");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  updateIp(){
    console.log("this IP: " + this.ip);
    if (this.ip && this.ip != '') {    
      Constants.API_BASE_URL = "http://" + this.ip + ":3076/api";
      localStorage.setItem("REQUEST_IP",this.ip);
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.showAlert('Error!', 'Debes ingresar una IP válida');
      return;
    }
  }
  showAlert(title, subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
  comboCompleteSetting(){
    console.log("this.comboComplete: " + this.comboComplete);
    localStorage.setItem("REQUEST_COMBO_COMPLETE", this.comboComplete);
  }

}
