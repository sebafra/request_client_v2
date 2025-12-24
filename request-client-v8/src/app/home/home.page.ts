import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonSpinner,
  IonFab,
  IonFabButton,
  AlertController, 
  NavController 
} from '@ionic/angular/standalone';
import { CategoryService } from '../core/services/category.service';
import { Category } from '../core/models/category.interface';
import { addIcons } from 'ionicons';
import { settings, person, search, calculator } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonSpinner,
    IonFab,
    IonFabButton
  ],
})
export class HomePage implements OnInit {
  private categoryService = inject(CategoryService);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);

  categories: Category[] = [];
  isBusy = false;
  branchName = 'Comanda'; // TODO: Fetch from config

  constructor() {
    addIcons({ settings, person, search, calculator });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isBusy = true;
    this.categoryService.getAll().subscribe({
      next: (items) => {
        this.categories = items;
        this.isBusy = false;
      },
      error: (err) => {
        console.error(err);
        this.isBusy = false;
      }
    });
  }

  goToArticles(category: Category) {
    this.navCtrl.navigateForward(['/tabs/home/articles', category.id]);
  }

  goToSettings() {
    this.navCtrl.navigateForward('/settings');
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  async showSearchByName() {
    const alert = await this.alertCtrl.create({
      header: 'Buscar por nombre',
      message: '(Mínimo 3 caracteres)',
      inputs: [{ name: 'search', type: 'text', placeholder: 'Ingrese nombre' }],
      buttons: [
        'Cancelar',
        {
          text: 'Buscar',
          handler: (data) => {
            if (data.search?.length >= 3) {
              this.navCtrl.navigateForward(['/tabs/home/articles', 'search'], {
                 queryParams: { term: data.search, type: 'name' }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showSearchByCode() {
    const alert = await this.alertCtrl.create({
      header: 'Buscar por código',
      inputs: [{ name: 'code', type: 'number', placeholder: 'Ingrese código' }],
      buttons: [
        'Cancelar',
        {
          text: 'Buscar',
          handler: (data) => {
            if (data.code) {
              this.navCtrl.navigateForward(['/tabs/home/articles', 'search'], {
                 queryParams: { term: data.code, type: 'code' }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }
  getIconName(icon: string | undefined): string {
    if (!icon) return 'fa fa-cutlery';
    const txt = icon.trim();
    return txt.length > 0 ? txt : 'fa fa-cutlery';
  }
}
