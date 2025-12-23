import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { OrderPage } from '../order/order';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Events, NavController, App } from 'ionic-angular';
import { Constants } from '../../app/app.constants';
import { TablesPage } from '../tables/tables';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: any;
  itemsInOrder: any;
  flag: any = undefined;

  tab1Root = HomePage;
  tab2Root = OrderPage;
  tab3Root = TablesPage;
  // tab3Root = ContactPage;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public app: App
  ) {
    this.itemsInOrder = Constants.CURRENT_ORDER.length;
    console.log(this.itemsInOrder);
  }
  ionViewWillEnter(){
    this.events.subscribe('backToHome', () => {
      console.log("Evento Back to home");
      this.navCtrl.setRoot(TabsPage)
    });
  }
  ionViewWillLeave(){
    this.events.unsubscribe('backToHome')
  }
  // ngAfterViewInit(){
  //   setTimeout(() => {
  //     this.flag = true;
  //   }, 500);
  // }
  // backToHome(){
  //   let page = this.app.getActiveNav().getActive().name;
  //   console.log("Page: " + page);
  //   if (page != 'HomePage' && this.flag) {      
  //     this.navCtrl.setRoot(TabsPage, {}, { animate: true, direction: 'forward', duration: 500 });
  //     this.flag = false;
  //   }
  // }
}
