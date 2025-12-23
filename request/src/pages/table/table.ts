import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the TablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
  providers:[OrderProvider]
})
export class TablePage {
  table:any
  items: any;
  constructor(
    public orderProvider:OrderProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams) {

    this.table = this.navParams.get("table")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablePage');
    this.getOrders()
  }
  getOrders(){
    let filters={"table":this.table.id}
    this.orderProvider.getAllFilterAndSortAndPopulates(filters, { item: 1 }, []).then(res => {
      this.items = res;
      console.log(res)
    })
  }
  getStatus(table) {
    let status_class: string;
    if ((table.status).trim() == "Cobrar") {
      status_class = "pay"
    }
    if (table.prefac) {
      status_class = "prefac"
    }
    return status_class;
  }
  getStatusText(){
    let txt: string;
    if ((this.table.status).trim() == "Cobrar"){
      txt = "para Cobrar"
    } else if (this.table.status == "Abierta"){
      txt = "Abierta"
    }
    if (this.table.prefac) {
      txt = "Prefacturada"
    }
    return txt;
  }
}
