import { Component } from '@angular/core';
import { NavController, ModalController, Events, AlertController, LoadingController, ToastController, Platform, ActionSheetController } from 'ionic-angular';
import { PedidoModalComponent } from '../../components/pedido-modal/pedido-modal';
import { HomePage } from '../home/home';
import { Constants } from '../../app/app.constants';
import { TableProvider } from '../../providers/table/table';
import { OrderProvider } from '../../providers/order/order';
import { TabsPage } from '../tabs/tabs';
import { PreferenceModalComponent } from '../../components/preference-modal/preference-modal';
import { WaiterProvider } from '../../providers/waiter/waiter';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ComboModalComponent } from '../../components/combo-modal/combo-modal';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers: [TableProvider, OrderProvider, WaiterProvider]
})
export class OrderPage {
  articles: any = [];
  pedidoModal: any;
  preferenceModal: any;
  isBusy: any;
  table: any;
  alert: any;
  loader: any;
  combo: any;
  public unregisterBackButtonAction: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events,
    public tableProvider: TableProvider,
    public orderProvider: OrderProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public waiterProvider: WaiterProvider,
    private ga: GoogleAnalytics,
    private actionSheetCtrl: ActionSheetController

  ) {

  }
  ionViewDidEnter() {
    this.articles = Constants.CURRENT_ORDER;
    //this.articles = Constants.CURRENT_ORDER.map(x => Object.assign({}, x));
    this.onLoadItems();
  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
  }
  onLoadItems() {
    console.log("Articles before process: ", this.articles);
    this.articles.forEach(article => {
      if (!article.combos && article.combo) {
        let cant = article.quantity;
        let el = JSON.parse(JSON.stringify(article));
        article.combos = [];
        console.log("Combo: ", article);
        for (let index = 0; index < cant; index++) {
          el.quantity = 1;
          let obj = JSON.parse(JSON.stringify(el));
          obj.order_number = index + 1;
          article.combos.push(obj);
          console.log("Obj Added: ", obj);
        }
      }
    });
    console.log("Articles after process: ", this.articles);
  }
  sendOrder() {
    this.pedidoModal = this.modalCtrl.create(PedidoModalComponent);
    this.pedidoModal.present({ animate: false });
    this.pedidoModal.onDidDismiss(data => {
      console.log("On dismiss " + data);
      if (Object.keys(data).length === 0) {
        console.log("Back");
      } else {
        console.log("Data antes de Procesar: " + JSON.stringify(data));
        Constants.CURRENT_ORDER = [];
        this.processPreferences(data);
      }
    });
  }
  processPreferences(data) {
    this.articles.forEach(article => {
      if (article.preference) {
        if (typeof article.preference === 'string' || article.preference instanceof String) {
          console.log("is a string");
        } else {
          article.preference = article.preference.filter(el => el.selected).map(el => el.description.trim()).join(',');
        }
        console.log(article);
      }
    });
    this.validateWaiter(data);
  }
  processComboPreferences(preferences){
    console.log("*** preferences *** ",preferences);
    let res;
    if(preferences){
      if (typeof preferences === 'string' || preferences instanceof String) {
        res = preferences; 
      } else {
        res = preferences.filter(el => el.selected).map(el => el.description.trim()).join(',');
      }
    } else {
      res = "";
    }
    return res;
  }
  validateWaiter(obj) {
    let filters = { 'id': Constants.BUSINESS_WAITER.id };
    let order = {};
    let populate = [];
    this.waiterProvider.getAllFilterAndSortAndPopulates(filters, order, populate).then(data => {
      console.log("Waiter Data: ", data);
      if (data[0].disabled) {
        this.sendToLogin();
      } else {
        this.checkTable(obj);
      }
    });

  }
  checkTable(data) {
    var self = this;
    this.presentLoading("Enviando pedido...");
    let filters = { "id": data.table };
    this.tableProvider.getAllFilterAndSortAndPopulates(filters, {}, []).then(item => {
      let table: any = item[0];
      console.table(table);
      // Chequear si la mesa tiene plano 0
      if (table.map == 0) {
        this.showAlert('MESA INHABILITADA', 'Esta mesa no está habilitada para cargar pedidos');
        this.loader.dismiss();
        return;
      }
      let estado = (table.status).trim();
      // Mesa con estado libre
      if (estado == 'Libre') {
        if (table.local == 0) {
          if (data.people !== '') {
            this.openTable(table.id, 'APP', 1, data.people);
          } else {
            //this.showAlert('NUEVA MESA', 'La mesa no está abierta es necesario ingresar cubiertos');
            this.loader.dismiss();
            setTimeout(() => {
              self.presentToast('La mesa no está abierta es necesario ingresar cubiertos');
              self.sendOrder();
            }, 300);
          }
        } else {
          this.showAlert('MESA NO DISPONIBLE', 'Puede que este tomada por otro camarero o abierta en otra terminal');
          this.loader.dismiss();
        }
        // Mesa ya abierta
      } else {
        if (table.local == 0) {
          // Verificar que el dato del mozo sea igual al que está logueado
          // Error, esta mesa está tomada x otro camarero (mostrar nombre)
          console.log(table.waiter + " " + Constants.BUSINESS_WAITER.id)
          if (table.waiter == Constants.BUSINESS_WAITER.id) {
            this.openTable(table.id, 'APP', 1, table.people);
          } else {
            this.showAlert('MESA TOMADA', 'Esta mesa está tomada por ' + table.waiter_name);
            this.loader.dismiss();
          }
          // TODO: va a ir apertura de la mesa existente
        } else {
          this.showAlert('MESA NO DISPONIBLE', 'Puede que este abierta en otra terminal');
          this.loader.dismiss();
        }
      }
    });
  }
  openTable(tableId, status, local, people) {
    let obj = {
      id: tableId,
      status: status,
      local: local,
      waiter: Constants.BUSINESS_WAITER.id,
      waiter_name: Constants.BUSINESS_WAITER.name,
      people: people
    };
    this.tableProvider.update(obj).then(item => {
      let res = item;
      console.table(res);
      //alert("Open table: " + res);
      if (res[0] == 1) {
        this.processOrder(tableId);
      } else {
        this.loader.dismiss();
      }

    });
  }
  processOrder(tableId) {
    let arr: any = [];
    let flag: boolean = false;
    // Articulo
    for (let index = 0; index < this.articles.length; index++) {
      let obj: any = {
        "table": tableId,
        "waiter": Constants.BUSINESS_WAITER.id,
        "code": this.articles[index].id,
        "description": this.articles[index].name,
        "quantity": this.articles[index].quantity,
        "preference": this.articles[index].preference || ''
      };
      // Combo cabecera
      if (this.articles[index].combo) {
        let combos = this.articles[index].combos;
        for (let n = 0; n < combos.length; n++) {
          let order: number = -Math.abs(index) - (n + 1);
          let element = combos[n];
          let combo_header: any = {
            "table": tableId,
            "waiter": Constants.BUSINESS_WAITER.id,
            "code": element.id,
            "description": element.name,
            "quantity": 1,
            //"preference": element.preference || '',
            "preference": this.processComboPreferences(element.preference),
            "combo": element.id,
            "combo_item": order
          }
          console.log("Cabecera combo", combo_header);
          arr.push(this.orderProvider.create(combo_header));
          // Combo componentes
          if (!element.combo_detail) {
            this.errorInProcessOrder(tableId, 0, "Debe completar todos los combos")
            return;
          }
          for (let i = 0; i < element.combo_detail.length; i++) {
            const el_data = element.combo_detail[i];
            let el: any = {
              "table": tableId,
              "waiter": Constants.BUSINESS_WAITER.id,
              "code": el_data.article_id,
              "description": "**" + el_data.name,
              "quantity": 1,
              "preference": '',
              "combo": el_data.combo,
              "combo_item": order,
              "combo_group": el_data.combo_group,
            }
            console.table(el);
            arr.push(this.orderProvider.create(el));
          }

        }
      } else {
        console.table("Art", obj);
        arr.push(this.orderProvider.create(obj))
      }
    }
    this.saveOrder(arr, tableId);
  }
  saveOrder(arr, tableId) {
    Promise.all(arr).then(values => {
      console.log("Promise All ::::::::::: ", values);
      this.closeTable(tableId, 0);
      this.loader.dismiss();
    }).catch(reason => {
      console.log(reason);
      this.loader.dismiss();
    });
  }
  closeTable(tableId, local) {
    let obj = {
      "id": tableId,
      "local": local
    };
    this.tableProvider.update(obj).then(item => {
      let res = item;
      console.table("Close table: " + res);
      this.presentToast("Pedido Enviado con Éxito");
      if (res[0] == 1) {
        this.backToHome();
      } else {
        this.loader.dismiss();
      }

    });
  }
  errorInProcessOrder(tableId, local, message) {
    let obj = {
      "id": tableId,
      "local": local
    };
    this.tableProvider.update(obj).then(item => {
      let res = item;
      console.table("Close table: " + res);
      this.presentToast(message);
      this.loader.dismiss();
    });
  }
  trackEvent() {
    this.ga.trackView('Order View')
      .then(() => {
        console.log('Order ok');
      })
    this.ga.trackEvent('Order', 'Send', Constants.BUSINESS_WAITER.id)
      .then(() => {
        console.log('Track Event ok');
      })
  }
  showPreference(article) {
    this.preferenceModal = this.modalCtrl.create(PreferenceModalComponent, { article: article });
    this.preferenceModal.present();
    this.preferenceModal.onDidDismiss(data => {
      console.log("On dismiss " + data);
      if (Object.keys(data).length === 0) {
        console.log("Back");
      } else {
        console.log(JSON.stringify(data));
        article.preference = data;
        console.log("Cerrar Modal: " + JSON.stringify(article));
      }
    });
  }
  confirmRemove(article) {
    const confirm = this.alertCtrl.create({
      title: "Borrar Artículo",
      message: '¿Desea borrar el artículo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            console.log('Agree clicked');
            this.removeArticle(article);
          }
        }
      ]
    });
    confirm.present();
  }
  removeArticle(article) {
    let index = Constants.CURRENT_ORDER.findIndex(x => x.id == article.id);
    let el = Constants.CURRENT_ORDER[index];
    if (el.combo) {
      let ix = el.combos.findIndex(x => x.order_number == article.order_number);
      el.combos.splice(ix, 1);
      el.quantity = el.combos.length;
      if (el.quantity == 0) {
        delete el['combos'];
        Constants.CURRENT_ORDER.splice(index, 1);
      }
    } else {
      Constants.CURRENT_ORDER.splice(index, 1);
    }
    console.table(this.articles);
    this.events.publish('updateOrder');
  }
  presentLoading(message) {
    this.loader = this.loadingCtrl.create({
      content: message,
      duration: 3000
    });
    this.loader.present();
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
  showAlert(title, message) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Entendido']
    });
    this.alert.present();
  }
  backToHome() {
    console.log("Call Back to home");

    this.navCtrl.parent.select(0);
    this.events.publish('backToHome');
    //this.navCtrl.setRoot(TabsPage)
    //this.navCtrl.setRoot(HomePage);
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
  sendToLogin() {
    const confirm = this.alertCtrl.create({
      title: 'Usuario Deshabilitado',
      message: 'Deberá loguearse nuevamente para continuar',
      buttons: [
        {
          text: 'Entendido',
          handler: () => {
            console.log('Send to Login');
            Constants.BUSINESS_WAITER = { id: '', name: '' };
            this.backToHome();
          }
        }
      ]
    });
    confirm.present();
  }

  showOptions(article) {
    let options = {
      title: '¿Que desea hacer?',
      buttons: [
        {
          text: 'Agregar una preferencia',
          role: 'destructive',
          handler: () => {
            console.log('Preferencia clicked');
            this.showPreference(article);
          }
        }, {
          text: 'Eliminar artículo',
          handler: () => {
            console.log('Combo clicked');
            this.removeArticle(article);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }
    if (article.combo && !article.combo_detail) {
      options.buttons.push({
        text: 'Detalle del Combo',
        handler: () => {
          console.log('Combo clicked');
          this.showCombo(article);
        }
      })
    }
    if (article.combo && article.combo_detail) {
      options.buttons.push({
        text: 'Ver Componentes',
        handler: () => {
          let message = '';
          for (var item of article.combo_detail) {
            let el;
            el = `<li>` + (item.name).trim() + `</li>`;
            console.log(el);
            message += el;
          }
          this.showAlert("Componentes",`<ul>` + message + `</ul>`)
        }
      })
    }
    const actionSheet = this.actionSheetCtrl.create(options);
    actionSheet.present();
  }
  showCombo(article) {
    this.combo = this.modalCtrl.create(ComboModalComponent,
      { "article": article },
      { cssClass: 'order-options' });
    this.combo.onDidDismiss(data => {
      console.log(article);
    });
    this.combo.present({ animate: false });
  }
}
