import { Component } from '@angular/core';
import { PreferenceProvider } from '../../providers/preference/preference';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PreferenceModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'preference-modal',
  templateUrl: 'preference-modal.html',
  providers: [PreferenceProvider]
})
export class PreferenceModalComponent {
  customPreference: string;
  preferenceId: any;
  preferences: any = [];
  article: any;


  constructor(
    public preferenceProvider: PreferenceProvider,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log('Hello PreferenceModalComponent Component');
    this.article = this.navParams.get('article');
    this.preferenceId = this.article.id;
  }

  ionViewDidEnter() {
    if (this.article.preference) {
      this.preferences = this.article.preference;
    } else {
      this.getPreferences(this.preferenceId)
    }
  }
  addPreference() {
    let el = this.customPreference;
    if (el.length != 0) {
      let obj = {
        description: el,
        selected: true
      }
      this.preferences.push(obj);
      this.customPreference = '';
    }
  }
  selectPreference(item) {
    if (!item.selected) {
      item.selected = true; 
    } else {
      item.selected = false; 
    }
  }
  getPreferences(id) {
    this.preferenceProvider.getById(id).then(item => {
      this.preferences = item;
    });
  }
  dismiss(flag) {
    this.viewCtrl.dismiss(this.preferences);
  }

}
