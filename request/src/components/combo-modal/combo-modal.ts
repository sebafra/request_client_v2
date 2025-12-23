import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController } from 'ionic-angular';
import { ComboProvider } from '../../providers/combo/combo';
import { ComboArticleProvider } from '../../providers/combo_article/combo_article';
import { Constants } from '../../app/app.constants';

/**
 * Generated class for the ComboModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'combo-modal',
  templateUrl: 'combo-modal.html',
  providers: [ComboProvider, ComboArticleProvider]
})
export class ComboModalComponent {
  isBusy: boolean = false;
  text: string;
  article: any = {};
  groups: any;
  combo: any;
  group_1: any = [];
  group_2: any = [];
  group_3: any = [];
  group_4: any = [];
  group_5: any = [];
  group_val_1: any = [];
  group_val_2: any = [];
  group_val_3: any = [];
  group_val_4: any = [];
  group_val_5: any = [];
  loader: any;

  constructor(
    public viewCtrl: ViewController,
    public comboProvider: ComboProvider,
    public comboArticleProvider: ComboArticleProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    console.log('Hello ComboModalComponent Component');
    this.article = this.navParams.get("article");
  }
  ionViewDidEnter() {
    this.isBusy = true;
    this.loadGroups();
  }
  loadGroups() {
    this.comboProvider.getById(this.article.id)
      .then(data => {
        console.log("Groups Data: ", data);
        this.groups = data;
        this.loadCombos();
      })
      .catch(e => {
        console.log("Ha ocurrido un error ", e);
        this.isBusy = false;
      })
  }
  loadCombos() {
    this.comboArticleProvider.getById(this.article.id)
      .then(data => {
        console.log("Combo Data: ", data);
        this.combo = data;
        this.processComboData(this.combo);
      })
      .catch(e => {
        console.log("Ha ocurrido un error ", e);
        this.isBusy = false;
      })
  }
  processComboData(array) {
    this.group_1 = array.filter(
      item => item.group === 1);
    this.group_2 = array.filter(
      item => item.group === 2);
    this.group_3 = array.filter(
      item => item.group === 3);
    this.group_4 = array.filter(
      item => item.group === 4);
    this.group_5 = array.filter(
      item => item.group === 5);
    this.isBusy = false;
  }
  validateType(obj) {
    let ret;
    if (typeof obj === 'string') {
      ret = [obj];
    } else {
      ret = obj;
    }
    return ret;
  }
  processCombo() {
    let group_val_1 = [];
    this.group_1.forEach(item => {
      group_val_1.push(item.article_id)
    });

    let arr: any = [
      group_val_1,
      this.validateType(this.group_val_2),
      this.validateType(this.group_val_3),
      this.validateType(this.group_val_4),
      this.validateType(this.group_val_5)
    ];

    if (arr[0].length == 0 && arr[1].length == 0 && arr[2].length == 0 && arr[3].length == 0 && arr[4].length == 0) {
      this.showError("Debe cargar algun componente del combo para continuar");
      return;
    }

    // VALIDACIÓN

    if (Constants.COMBO_COMPLETE == "true") {

      if (arr[1].length !== this.groups.group_2_ud) {
        this.showError("Debe seleccionar " + this.groups.group_2_ud + " ud en " + this.groups.group_2_name);
        return;
      }
      if (arr[2].length !== this.groups.group_3_ud) {
        console.log(arr[2].length)
        this.showError("Debe seleccionar " + this.groups.group_3_ud + " ud en " + this.groups.group_3_name);
        return;
      }
      if (arr[3].length !== this.groups.group_4_ud) {
        console.log(arr[3].length)
        this.showError("Debe seleccionar " + this.groups.group_4_ud + " ud en " + this.groups.group_4_name);
        return;
      }
      if (arr[4].length !== this.groups.group_5_ud) {
        console.log(arr[4].length)
        this.showError("Debe seleccionar " + this.groups.group_5_ud + " ud en " + this.groups.group_5_name);
        return;
      }

    } else {

      if (arr[1].length > this.groups.group_2_ud) {
        this.showError("Solo puede cargar " + this.groups.group_2_ud + " ud en " + this.groups.group_2_name);
        return;
      }
      if (arr[2].length > this.groups.group_3_ud) {
        this.showError("Solo puede cargar " + this.groups.group_3_ud + " ud en " + this.groups.group_3_name);
        return;
      }
      if (arr[3].length > this.groups.group_4_ud) {
        this.showError("Solo puede cargar " + this.groups.group_4_ud + " ud en " + this.groups.group_4_name);
        return;
      }
      if (arr[4].length > this.groups.group_5_ud) {
        this.showError("Solo puede cargar " + this.groups.group_5_ud + " ud en " + this.groups.group_5_name);
        return;
      }
    }

    this.saveCombo(arr);
  }
  showError(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  saveCombo(arr) {
    let index = Constants.CURRENT_ORDER.findIndex(x => x.id == this.article.id);
    let el = Constants.CURRENT_ORDER[index];
    let ix = el.combos.findIndex(x => x.order_number == this.article.order_number);
    var array = el.combos[ix];
    array.combo_detail = [];

    for (let i = 0; i < arr.length; i++) {
      arr[i].forEach(group => {
        let obj = {
          "name": this.getName(group),
          "article_id": group,
          "combo": this.article.id,
          "combo_group": i + 1
        }
        array.combo_detail.push(obj);
      })
    }
    console.log(el);
    this.dismiss();
  }
  getName(id) {
    var el = this.combo.filter(item => item.article_id === id)
    return el[0].article.name;
  }
  dismiss() {
    let data: any = {};
    this.viewCtrl.dismiss(data);
  }
}
