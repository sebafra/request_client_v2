import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FilterPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'filter-popover',
  templateUrl: 'filter-popover.html'
})
export class FilterPopoverComponent {
  subcategories: any = [];
  text: string;
  todos: any = {
    name: 'Todos',
    checked: true
  }
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
    ) {
    console.log('Hello FilterPopoverComponent Component');
    const subcategories = navParams.get('subcategories')
    
    this.subcategories = subcategories.filter(el => {
      if (el.name && el.name.trim()) {
        el.name = el.name.trim();
        el.checked = false;
        return el;
      }
    });
  
    console.log(this.subcategories);
    
    const subcategorySelected = navParams.get('subcategorySelected');
    if (subcategorySelected) {
      const index = this.subcategories.indexOf(subcategorySelected);
      this.subcategories[index].checked = true;
      this.todos.checked = false;
    } else {
      this.todos.checked = true;
    }

  } 

  selectSubcategory(item) {
    if (item.name === 'Todos') {
      this.viewCtrl.dismiss({todos: true});
    } else {
      this.viewCtrl.dismiss({subcategory: item});
    }
  }
  
  
  ionViewWillLeave() {
    this.subcategories = [];
  }

}
