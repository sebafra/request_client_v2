import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, PopoverController } from 'ionic-angular';
import { Constants } from '../../app/app.constants';
import { ArticleProvider } from '../../providers/article/article';
import { FilterPopoverComponent } from '../../components/filter-popover/filter-popover';
import { SubcategoryProvider } from '../../providers/subcategory/subcategory';

/**
 * Generated class for the ArticlesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
  providers: [ArticleProvider, SubcategoryProvider]
})
export class ArticlesPage {
  searchCounter: any = 0;
  category: any;
  isBusy: any = false;
  title: string = "Cargando..."
  articles: any = []
  quantity: number = 0;
  articles_filtered: any = [];
  articles_filtered_by_cat: any = [];
  textSearch: string = '';
  searchTerm: string;
  subcategorySelected: any;
  subcategories: any = [];
  code: boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public articleProvider: ArticleProvider,
    public subcategoryProvider: SubcategoryProvider,
    public events: Events,
    public popoverCtrl: PopoverController
    ) {
      this.category = this.navParams.get("category");
      this.searchTerm = this.navParams.get("searchTerm");
      this.code = this.navParams.get("code");
      console.log("this.category: " + this.category);
      console.log("this.searchTerm: " + this.searchTerm);
      console.log("this.code: " + this.code);
      if (this.category) {
        this.title = this.category.name; 
        this.getSubCategories(this.category.id);
      } else {
        this.title = "Búsqueda por nombre"
      }
      events.subscribe('updateOrder', () => {
        this.ionViewDidLoad()
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticlesPage');
    this.loadArticles();
  }
  ionViewDidEnter() {
    var self = this;
    if (Constants.CURRENT_ORDER.length != 0) {
      setTimeout(() => {
        self.updateArticles();
      }, 200); 
    }
  }
  filter(myEvent) {
    let popover = this.popoverCtrl.create(FilterPopoverComponent, { 
      subcategories: this.subcategories,
      subcategorySelected: this.subcategorySelected});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss((data)=> this.getArticlesBySubcategory(data))
  }
  loadArticles() {
    this.isBusy = true;
    let filters = { 'INVISIBL': 0, 'SEVENDE': 1 };
    // if (this.searchTerm) {
    //   Object.assign(filters, {'descrip': this.searchTerm})
    // }
    // console.log("Filters after: " + JSON.stringify (filters));  
    let order = { subcategoryId: 1 };
    let populate = ['category'];

    this.articleProvider.getAllFilterAndSortAndPopulates(filters,order,populate).then(items => {
      let res: any;
      this.articles = items;
      if (this.category) { 
        res = items.filter(item => item.categoryId === this.category.id);
        console.log('responseee', res);
        let result = res.sort((a, b) => a.name <= b.name ? -1 : 1);
        
        this.articles_filtered = result;
        this.articles_filtered_by_cat = result;
      }
      if (this.searchTerm) {
        this.articles_filtered = items;
        this.searchItem();
      }
      console.log(this.articles);
      this.isBusy = false;
    });
  }

  updateArticles(){
    this.isBusy = true;
    console.log("Update Articles");
    let arr: any;
    arr = Constants.CURRENT_ORDER;
    //let currentOrder = Constants.CURRENT_ORDER;
    //arr = currentOrder.filter(item => this.category == item.categoryId);

    for (let index = 0; index < arr.length; index++) {
      let currentOrderItem = arr[index];
      for (let item of this.articles_filtered) {
        if (item.id == currentOrderItem.id) {
          item.quantity = currentOrderItem.quantity;
          if (item.preference) {
            item.preference = currentOrderItem.preference;
          }
        }
      }
    }
    this.isBusy = false;
  }

  //Events

  tapEvent(article) {
    let el = this.articles.filter(item => item.id == article.id);
    let element = el[0];
    if (element.quantity) {
      element.quantity = parseInt(element.quantity) + 1;
    } else {
      element.quantity = 1;
    }
    
    this.updateOrder(article);
  }
  swipeEvent(article) {
    let el = this.articles.filter(item => item.id == article.id);
    let element = el[0];
    console.log("element.quantity :" + element.quantity);
    if (element.quantity != 0 && element.quantity != null && element.quantity != undefined) {
      element.quantity = parseInt(element.quantity) - 1;
      this.updateOrder(article);
      console.log("element.quantity after :" + element.quantity);
    } 
  }
  showInfo() {
    const alert = this.alertCtrl.create({
      title: 'En cada artículo',
      subTitle: "<ul><li>TOQUE para agregar</li><li>DESLICE para quitar</li></ul>",
      buttons: ['Entendido']
    });
    alert.present();
  }
  updateOrder(article){
    let order = Constants.CURRENT_ORDER;
    let el = order.filter(item => article.id === item.id);
    if (el.length != 0) {
      if (el[0].quantity == 0) {
        //let arr = order.splice(2, 1);
        for (var i = 0; i < order.length; i++) {
          if (order[i].id === article.id) {
            order.splice(i, 1);
          }
        }
      } else {
        el[0].quantity = article.quantity;
      }
    } else {
      order.push(article);
    }
  }

  searchClear(event) {
    let self = this;
    this.searchCounter++;
    //alert(this.searchCounter);
    // Workaround for cancel search running twice on click...Ionic team issue.
    if (this.searchCounter == 1) {
      //alert("inside: " + this.searchCounter);
      setTimeout(() => {
        //self.searchArticles();
        self.articles_filtered = self.articles_filtered_by_cat;
        self.subcategorySelected = '';
        self.searchCounter = 0;
      }, 0);
    }
  }
  /// SEARCH ENGINE
  searchArticles() {
    this.textSearch = this.textSearch.toLowerCase()
    let articles_filtered: any = this.find(this.articles_filtered_by_cat, this.textSearch);
    // articles_filtered: any = this.findByName(this.articles, this.textSearch);
    if (articles_filtered.length == 0) {
      this.articles_filtered = this.articles_filtered_by_cat;
      //this.articles_filtered = this.articles;
    } else {
      this.articles_filtered = articles_filtered;
    }
  }
  searchItem() {
    this.textSearch = this.searchTerm.toLowerCase()
    let articles_filtered: any;
    console.log(this.code);
    if (!this.code) {
      articles_filtered = this.findByName(this.articles, this.textSearch);
    } else {
      articles_filtered = this.findByCode(this.articles, this.textSearch);
    }
    if (articles_filtered.length == 0) {
      this.articles_filtered = [];
    } else {
      this.articles_filtered = articles_filtered;
    }
  }

  findByName(items, text) {
    text = text.split(' ');
    return items.filter(item => {
      return text.every(el => {
        return (
          item.name.toLowerCase().trim().indexOf(el) > -1
        )
      });
    });
  }
  find(items, text) {
    text = text.split(' ');
    return items.filter(item => {
      return text.every(el => {
        return (
          item.name.toLowerCase().trim().indexOf(el) > -1
        )
      });
    });
  }
  findByCode(items, text) {
    text = text.trim().split('');
    let newText = text.reverse().concat([0,0,0]);
    text = newText.splice(0,4).reverse().join('');
    console.log("texto: " + text);
    text = text.split(' ');

    return items.filter(item => {
      return text.every(el => {
        return (
          item.id.trim().indexOf(el) > -1
        )
      });
    });
  }
  ionViewWillLeave() {
    this.events.unsubscribe('updateOrder');
    // setTimeout(() => {
    //   this.articles_filtered.forEach(el => {
    //     if (el.quantity > 0) {
    //       el.quantity = 0;
    //     }
    //   });      
    // }, 2000);
  }


  getSubCategories(CategoryId) {
    this.subcategoryProvider.getAllFilterAndSortAndPopulates({},{},[])
      .then(res => {
        console.log('subcategories', res);
        this.subcategories = res.filter(el => el.id === CategoryId);
        console.log(`subcategories filtrados`, this.subcategories);
      })
      .catch(err => {
        console.log(err);
        
      })
  }

  getArticlesBySubcategory(data) {
    if (data) {
      if (data.todos) {
        this.articles_filtered = this.articles.filter(el => el.categoryId === this.category.id);
        this.subcategorySelected = null;
      } else {
        this.subcategorySelected = data.subcategory;
        this.articles_filtered = this.articles.filter(el => el.categoryId === this.category.id && el.subcategory.categoryId === data.subcategory.categoryId);
      }
    }
  }

  
}
