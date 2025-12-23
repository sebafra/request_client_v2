import { Component, } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TableProvider } from '../../providers/table/table'
import { TablePage } from '../table/table';
import { Constants } from '../../app/app.constants';
import { stringify } from '@angular/core/src/util';

/**
 * Generated class for the TablesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tables',
  templateUrl: 'tables.html',
  providers: [TableProvider]
})
export class TablesPage {

  list: any = []
  isBusy: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public waiterProvider: TableProvider
  ) {

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad TablesPage');
    this.getTables();
  }
  getTables(){
    this.isBusy = true;
    let filter = { 'waiter': Constants.BUSINESS_WAITER.id }
    this.waiterProvider.getAllFilterAndSort(filter, {}).then(res => {
      console.log(res)
      this.list = res
      this.isBusy = false;
    })
      .catch(err => {
        console.log("ha ocurrido un error");
        this.isBusy = false;
      })
  }
  openTable(table) {
    this.navCtrl.push(TablePage, { table })
  }
  getStatus(table){
    let status_class: string;
    if ((table.status).trim() == "Cobrar") {
      status_class = "pay"
    }
    if (table.prefac) {
      status_class = "prefac"
    }
    return status_class;
  }
}



