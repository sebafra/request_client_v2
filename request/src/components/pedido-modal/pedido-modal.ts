import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavController, TextInput } from 'ionic-angular';
import { Constants } from '../../app/app.constants';

/**
 * Generated class for the PedidoModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pedido-modal',
  templateUrl: 'pedido-modal.html'
})
export class PedidoModalComponent {
  text: string;
  table: any = ''
  people: any = ''
  waiter: any;
  flag: boolean = false;
  busy: boolean = false;
  @ViewChild('myInput') myInput: TextInput;
  @ViewChild('myInput2') myInput2: TextInput;

  constructor(
    public viewCtrl:ViewController,
    public navCtrl: NavController,
    public cdRef: ChangeDetectorRef
    ) {
    console.log('Hello PedidoModalComponent Component');
    this.text = 'Hello World';
    this.waiter = Constants.BUSINESS_WAITER.name;
  }
  // ngAfterViewChecked() {
  //   if (!this.flag) {
  //     var self = this;
  //     setTimeout(() => {
  //       self.myInput.setFocus();
  //       self.flag = true;
  //     }, 250); //a least 150ms. 
  //   }
  // }
  ionViewDidLoad() {
    var self = this;
    setTimeout(() => {
      self.myInput.setFocus();
    }, 200);
  }
  changeTable(value) {
    this.cdRef.detectChanges();
    this.table = value.length > 3 ? value.substring(0, 3) : value;
  }
  changePeople(value) {
    this.cdRef.detectChanges();
    this.people = value.length > 3 ? value.substring(0, 3) : value;
  }
  dismiss(flag) {
    this.busy = true;
    setTimeout(() => {
      this.busy = false;
    }, 4000);
    let data: any = {};
    if (flag) {
      data.table = this.table;
      data.people = this.people;
      if (data.table == '') {
        alert("Debe ingresar mesa para poder enviar el pedido");
        return;
      }
    } 
    this.viewCtrl.dismiss(data);
  }
  goNext(){
    var self = this;
      self.myInput2.setFocus();
  }

}
