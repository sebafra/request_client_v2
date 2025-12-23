import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  NavController 
} from '@ionic/angular/standalone';
import { TableService } from '../core/services/table.service';
import { Table } from '../core/models/table.interface';
import { addIcons } from 'ionicons';
import { refresh, person } from 'ionicons/icons';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
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
    IonSpinner
  ]
})
export class TablesPage implements OnInit {
  private tableService = inject(TableService);
  private navCtrl = inject(NavController);

  tables: Table[] = [];
  isBusy = false;

  constructor() {
    addIcons({ refresh, person });
  }

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.isBusy = true;
    
    // Get waiter from local storage
    const waiterJson = localStorage.getItem('REQUEST_WAITER');
    let waiterId = null;
    
    if (waiterJson) {
      try {
        const waiter = JSON.parse(waiterJson);
        waiterId = waiter.id;
      } catch (e) {
        console.error('Error parsing waiter from local storage', e);
      }
    }

    if (!waiterId) {
      console.error('No waiter logged in');
      this.isBusy = false;
      return;
    }

    const filters = { waiter: waiterId };

    this.tableService.getAll(filters).subscribe({
      next: (res) => {
        this.tables = res;
        this.isBusy = false;
      },
      error: (err) => {
        console.error(err);
        this.isBusy = false;
      }
    });
  }

  openTable(table: Table) {
    this.navCtrl.navigateForward(['/table-detail'], {
      state: { table }
    });
  }

  getTableStatusClass(table: any): string {
    const status = table.status?.trim();
    if (status === 'Cobrar') return 'pay';
    if (table.prefac) return 'prefac';
    if (status === 'Ocupada') return 'occupied';
    return 'free';
  }
}
