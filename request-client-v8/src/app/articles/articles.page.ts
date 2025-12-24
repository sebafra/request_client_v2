import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonBackButton, 
  IonIcon, 
  IonSearchbar, 
  IonSpinner, 
  IonList, 
  IonItem, 
  IonItemSliding, 
  IonItemOptions, 
  IonItemOption, 
  IonLabel, 
  IonBadge,
  NavController, 
  PopoverController, 
  AlertController,
  IonChip
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../core/services/article.service';
import { CategoryService } from '../core/services/category.service';
import { OrderService } from '../core/services/order.service';
import { SubcategoryService } from '../core/services/subcategory.service';
import { addIcons } from 'ionicons';
import { cart, arrowBack, search, funnel, funnelOutline, informationCircle, add, remove, trash, cubeOutline, layers } from 'ionicons/icons';
import { FilterPopoverComponent } from '../components/filter-popover/filter-popover.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonBackButton, 
    IonIcon, 
    IonSearchbar, 
    IonSpinner, 
    IonList, 
    IonItem, 
    IonItemSliding, 
    IonItemOptions, 
    IonItemOption, 
    IonLabel, 
    IonBadge,
    IonChip
  ]
})
export class ArticlesPage implements OnInit {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private popoverCtrl = inject(PopoverController);
  private alertCtrl = inject(AlertController);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private subcategoryService = inject(SubcategoryService);
  public orderService = inject(OrderService);

  categoryId: string | null = null;
  articles = signal<any[]>([]);
  filteredArticles = signal<any[]>([]);
  subcategories = signal<any[]>([]);
  selectedSubcategory = signal<any | null>(null); // Trackear subcategoría seleccionada
  title = 'Artículos';
  isBusy = false;
  searchText = '';
  
  // Search params
  isSearchMode = false;
  searchType: 'name' | 'code' | null = null;

  constructor() {
    addIcons({ cart, arrowBack, search, funnel, funnelOutline, informationCircle, add, remove, trash, cubeOutline, layers });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Clear previous state
      this.articles.set([]);
      this.filteredArticles.set([]);
      this.subcategories.set([]);
      this.selectedSubcategory.set(null); // Limpiar filtro al cambiar de categoría
      this.searchText = '';
      this.isBusy = true;
      
      const idParam = params.get('categoryId');

      // Check query params for search mode
      this.route.queryParams.subscribe(queryParams => {
        if (idParam === 'search') {
          this.isSearchMode = true;
          this.title = 'Búsqueda';
          this.searchType = queryParams['type'];
          const term = queryParams['term'];
          if (term) {
             this.searchText = term;
             this.performGlobalSearch(term, this.searchType);
          } else {
            this.isBusy = false;
          }
        } else {
          this.isSearchMode = false;
          this.categoryId = idParam;
          if (this.categoryId) {
            this.loadArticlesByCategory(this.categoryId);
            this.loadSubcategories(this.categoryId);
          }
        }
      });
    });
  }

  loadArticlesByCategory(catId: string) {
    this.articleService.getAll().subscribe({
      next: (items) => {
        // Enforce client-side filtering to match legacy behavior/ensure correctness
        const filtered = items.filter(i => i.categoryId == catId);
        this.articles.set(filtered);
        this.filteredArticles.set(filtered);
        
        // Fetch category name for title
        this.categoryService.getById(catId).subscribe({
          next: (category) => {
            this.title = category.name || 'Categoría ' + catId;
          },
          error: () => {
            this.title = 'Categoría ' + catId;
          }
        });
        
        this.isBusy = false;
      },
      error: (err) => {
        console.error(err);
        this.isBusy = false;
      }
    });
  }

  loadSubcategories(catId: string) {
    this.subcategoryService.getAll().subscribe({
      next: (subs) => {
        // Filtrar por categoría y excluir subcategorías con nombre vacío
        const filtered = subs.filter(s => {
          const matchesCategory = (s.categoryId || s.category) == Number(catId);
          const hasName = s.name && s.name.trim().length > 0;
          return matchesCategory && hasName;
        });
        this.subcategories.set(filtered);
      }
    });
  }

  performGlobalSearch(term: string, type: 'name' | 'code' | null) {
      this.articleService.getAll().subscribe({
          next: (allArticles) => {
              this.articles.set(allArticles); 
              
              if (type === 'code') {
                  const padded = term.padStart(4, '0');
                  const results = allArticles.filter(a => (a as any).id && (a as any).id.toString().includes(padded));
                  this.filteredArticles.set(results);
              } else {
                  const terms = term.toLowerCase().split(' ');
                  const results = allArticles.filter(a => 
                      terms.every(t => a.name && a.name.toLowerCase().includes(t))
                  );
                  this.filteredArticles.set(results);
              }
              this.isBusy = false;
          },
          error: (e) => {
              console.error(e);
              this.isBusy = false;
          }
      });
  }

  searchArticles() {
    let text = this.searchText.trim().toLowerCase();
    if (!text) {
      this.filteredArticles.set(this.articles());
      return;
    }
    
    const isCode = /^\d+$/.test(text);

    if (isCode) {
      const paddedCode = text.padStart(4, '0');
      this.filteredArticles.set(
        this.articles().filter(item => (item as any).id && (item as any).id.toString().includes(paddedCode))
      );
    } else {
      const searchTerms = text.split(' ');
      const result = this.articles().filter(item => {
        return searchTerms.every(term => 
          item.name && item.name.toLowerCase().includes(term)
        );
      });
      this.filteredArticles.set(result);
    }
  }

  async showFilter(event: any) {
    const popover = await this.popoverCtrl.create({
      component: FilterPopoverComponent,
      event: event,
      componentProps: {
        subcategories: this.subcategories(),
        selectedSubcategory: this.selectedSubcategory()
      }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    // Check if data is explicitly passed (can be null for "Todas")
    // If dismissed without selection, data is undefined. 
    // Logic: select(null) -> data is null. select(item) -> data is item.
    if (data !== undefined) {
      this.filterBySubcategory(data);
    }
  }

  filterBySubcategory(subcategory: any) {
    // Actualizar la subcategoría seleccionada
    this.selectedSubcategory.set(subcategory);
    
    if (!subcategory) {
      this.filteredArticles.set(this.articles());
    } else {
      // Use loose equality for safety if id types mismatch
      const filtered = this.articles().filter(a => a.subcategoryId == subcategory.id);
      this.filteredArticles.set(filtered);
    }
  }

  getQuantity(article: any): number {
    const cartItem = this.orderService.cart().find(i => i.id === article.id);
    return cartItem ? cartItem.quantity : 0;
  }

  addOne(article: any, slidingItem?: any) {
    this.orderService.addToCart(article);
    if (slidingItem) slidingItem.close();
  }

  removeOne(article: any, slidingItem?: any) {
    this.orderService.removeFromCart(article.id);
    if (slidingItem) slidingItem.close();
  }

  async showInfo() {
    const alert = await this.alertCtrl.create({
      header: 'En cada artículo',
      subHeader: '• TOQUE para agregar\n• DESLICE para quitar',
      buttons: ['Entendido']
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
