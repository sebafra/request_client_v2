import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, App, Platform, AlertController, ToastController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ArticlesPage } from '../articles/articles';
import { ContactPage } from '../contact/contact';
import { Constants } from '../../app/app.constants';
import { SettingsPage } from '../settings/settings';
import { text } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ CategoryProvider]
})
export class HomePage {
  categories: any = [];
  isBusy: boolean = false;
  waiter: any;
  branch: any = Constants.BUSINESS_BRANCH;
  public unregisterBackButtonAction: any;

  constructor(
    public navCtrl: NavController,
    public categoryProvider: CategoryProvider,
    public app: App,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastController: ToastController
    ) {
      this.waiter = Constants.BUSINESS_WAITER;
      this.categories = []
  }

  ionViewDidLoad() {
    console.log('Categorias');
    if (this.waiter.id != '') {
      setTimeout(() => {
        this.loadCategories();
      }, 200);
    } else {
     this.showLogin();
    }
    this.initializeBackButtonCustomHandler();
  }
  getImage(item){
    let url = "assets/imgs/rubros/btn_ped_rub"+ item.id +".png"
    return url;
  }
  loadCategories() {
    //console.log("load categories: " + Constants.API_BASE_URL);
    this.isBusy = true;
    this.categoryProvider.getAll().then(items => {
      this.categories = items;
      console.log(this.categories);
      this.isBusy = false;
    });
  }
  showArticles(category){
    this.navCtrl.push(ArticlesPage,{category})
  }
  // showLogin(){
  //   this.navCtrl.push(ContactPage)
  // }
  isValid(item) {
    let ret = false;
    let name = (item.name).trim();
    if (name.length !== 0 && item.code !== 9999) {
      ret = true
    }
    return ret;
  }
  showLogin() {
    this.app.getRootNav().push(ContactPage);
  }
  showSettings() {
    this.app.getRootNav().push(SettingsPage);
  }
  showSearchByName() {
    const prompt = this.alertCtrl.create({
      title: 'Buscar por nombre de artículo',
      message: "(Ingrese 3 caracteres como minimo)",
      inputs: [
        {
          name: 'search',
          placeholder: 'Ingrese un nombre'
        },
      ],
      buttons: [
        {
          text: 'Volver',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            console.log('Search clicked');
            if (data.search.length >= 3) {
              this.navCtrl.push(ArticlesPage, { searchTerm: data.search, code: false})
            } else {
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }
  showSearchByCode() {
    const prompt = this.alertCtrl.create({
      title: 'Buscar por código',
      message: "",
      inputs: [
        {
          name: 'search',
          placeholder: 'Ingrese un código',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Volver',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            console.log('Search clicked');
            if (data.search.length) {
              this.navCtrl.push(ArticlesPage, {searchTerm:data.search,code:true})
            } else {
              //return false;
              this.presentToast("Debe ingresar al menos un caracter")
              
            }
          }
        }
      ]
    });
    prompt.present();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    let self = this;
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function (event) {
      self.confirmLeave();
    }, 101);
  }

  confirmLeave() {
    const confirm = this.alertCtrl.create({
      title: 'Salir de la Aplicación',
      message: '¿Desea salir de la Aplicación? Se borrarán los datos de la orden',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Salir',
          handler: () => {
            console.log('Agree clicked');
            this.platform.exitApp();
          }
        }
      ]
    });
    confirm.present();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  getIconName(icon){
    let txt: string = icon.trim();
    let res: string;
    if (txt.length !== 0) {
      res = txt;
    } else {
      res = "fa fa-cutlery"
    }
    return res;
  }

}
