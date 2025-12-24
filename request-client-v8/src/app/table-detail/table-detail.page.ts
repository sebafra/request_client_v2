import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonIcon, 
  IonSpinner,
  IonButton,
  IonNote,
  NavController 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OrderService } from '../core/services/order.service';
import { Table } from '../core/models/table.interface';
import { addIcons } from 'ionicons';
import { time, arrowBack, restaurantOutline } from 'ionicons/icons';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.page.html',
  styleUrls: ['./table-detail.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonIcon, 
    IonSpinner,
    IonButton,
    IonNote
  ]
})
export class TableDetailPage implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private navCtrl = inject(NavController);

  table: Table | null = null;
  orders: any[] = [];
  isBusy = false;

  constructor() {
    addIcons({ time, arrowBack, restaurantOutline });
    
    // Get table from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.table = navigation.extras.state['table'];
    }
  }

  ngOnInit() {
    if (this.table) {
      this.loadOrders();
    }
  }

  loadOrders() {
    if (!this.table) return;

    this.isBusy = true;
    const filters = { table: this.table.id };
    const sort = { createdAt: -1 }; // Ordenar por más reciente primero

    this.orderService.getAll(filters, sort, []).subscribe({
      next: (res) => {
        this.orders = res;
        this.isBusy = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isBusy = false;
      }
    });
  }

  getTableStatusClass(): string {
    if (!this.table) return '';
    const status = this.table.status?.trim();
    if (status === 'Cobrar') return 'pay';
    if (this.table.prefac) return 'prefac';
    return '';
  }

  getStatusText(): string {
    if (!this.table) return '';
    const status = this.table.status?.trim();
    if (status === 'Cobrar') return 'para Cobrar';
    if (this.table.prefac) return 'Prefacturada';
    if (status === 'Abierta') return 'Abierta';
    return status || '';
  }

  goBack() {
    this.navCtrl.back();
  }

  formatTime(date: any): string {
    if (!date) return '';
    
    // If it's already a time string like "HH:mm:ss"
    if (typeof date === 'string' && date.includes(':')) {
      return date.substring(0, 5);
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return date.toString(); // Return as is if invalid date but not empty
    }

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
