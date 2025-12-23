import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { WaiterProvider } from '../../providers/waiter/waiter';
import { Constants } from '../../app/app.constants';
import { SettingsPage } from '../settings/settings';
import { ChangeDetectorRef } from '@angular/core';
import { BranchProvider } from '../../providers/branch/branch';
import { ValidateProvider } from '../../providers/validate/validate';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [WaiterProvider, BranchProvider, ValidateProvider ]
})
export class ContactPage {
  constants: any = Constants;
  waiter: string = '';
  waiterObj: any;
  version: string = Constants.APP_VERSION
  ip: string;
  branchInfo: any;
  public unregisterBackButtonAction: any;
  constructor(
    public navCtrl: NavController,
    public waiterProvider: WaiterProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public cdRef: ChangeDetectorRef,
    public branchProvider: BranchProvider,
    public validateProvider: ValidateProvider,
    private ga: GoogleAnalytics,
    ) {
      this.waiterObj = Constants.BUSINESS_WAITER;
      //Constants.CURRENT_SERVER = { ip: '12.12.12.12' }; 
    //console.log(Constants.CURRENT_SERVER);
      
  }
  backToHome(){
    this.navCtrl.setRoot(TabsPage);
  }
  // login(){
  //   this.branchProvider.getAllFilterAndSortAndPopulates([], [], []).then(data => {
  //     //console.log(data);
  //     Constants.BUSINESS_BRANCH.name = data.name;
  //     Constants.BUSINESS_BRANCH.id = data.id;
  //     console.log(Constants.BUSINESS_BRANCH);
  //     this.dologin();
  //   });

  // }
  
  login() {
    if (this.waiter == '') {
      this.showAlert('Error en Ingreso!','Debes ingresar un número de vendedor',);
      return;
    }
    //this.dologin();
    
    this.validateProvider.getAllFilterAndSortAndPopulates().then((data: any) => {
      console.log('DATAA', data);
      if (data.offline) {
        this.branchInfo = JSON.parse(localStorage.getItem("REQUEST_BUSINESS_BRANCH"));
        if (!this.branchInfo) {
          this.presentToast("Debes validar tu aplicación para continuar");
          return;
        }
      } else {
        this.branchInfo = data;
        localStorage.setItem("REQUEST_BUSINESS_BRANCH",JSON.stringify(this.branchInfo));
      }
      console.log(Constants.BUSINESS_BRANCH);
      Constants.BUSINESS_BRANCH.name = this.branchInfo.nomLocal;
      Constants.BUSINESS_BRANCH.id = this.branchInfo.numLocal;
      this.dologin();
    })
    .catch(err => {
      //TODO ver mensaje de error
      console.log("CATCH REQUEST API",err);
      this.loginInvalid(err.message)
    })

  }
  dologin() {
    let filters = { 'INHAB': 0, 'id': this.waiter };
    let order = {};
    let populate = [];
    console.log("Api URL: " + Constants.API_BASE_URL);
    this.waiterProvider.getAllFilterAndSortAndPopulates(filters, order, populate).then(data => {
      console.log("Get Vendedor res: ", data);
      if (data.length == 0 ) {
        this.showAlert('Error en Ingreso!','El vendedor que ingresaste no está registrado en el sistema')
      } else {
        let waiter = data[0];
        Constants.BUSINESS_WAITER = data[0];
        console.log(JSON.stringify(Constants.BUSINESS_WAITER));
        //Analytics
        console.log(this.waiter);
        this.ga.setUserId(this.waiter)
          .then(() => {
            console.log('Google analytics set user as ' + this.waiter);
          })
          .catch(e => console.log('Error GoogleAnalytics', e));
        this.backToHome();
        this.presentToast("Hola " + waiter.name);
        // Añadir el borrado en localstorage de los artículos
        var key; 
        for (var i = 0; i < localStorage.length; i++) { 
          key = localStorage.key(i);
          let firstChar = key.charAt(0);
          if(firstChar == "/"){ 
            localStorage.removeItem(key); 
          }
        }
      }
    })
    .catch(e => alert(e));
  }
  showSettings(){
    this.navCtrl.push(SettingsPage)
  }
  logout(){
    Constants.BUSINESS_WAITER = {id:'',name:''};
    this.presentToast("Ha salido del sistema");
    this.backToHome();
  }
  back() {
    this.backToHome();
  }
  showAlert(title,subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
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
  change(value) {
    this.cdRef.detectChanges();
    this.waiter = value.length > 3 ? value.substring(0, 6) : value;
  }

  confirmLeave() {
    const confirm = this.alertCtrl.create({
      title: 'Salir!',
      message: '¿Desea salir de la Aplicación?',
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
  loginInvalid(message) {
    const confirm = this.alertCtrl.create({
      title: 'Error de Registro',
      message: message,
      buttons: [
        {
          text: 'Entendido',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
