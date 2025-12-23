import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { book, calculator, apps } from 'ionicons/icons';
import { OrderService } from '../core/services/order.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="book"></ion-icon>
          <ion-label>Menu</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="order" href="/tabs/order">
          <ion-icon name="calculator"></ion-icon>
          <ion-label>Orden</ion-label>
          @if (orderService.cartCount() > 0) {
            <ion-badge color="danger">{{ orderService.cartCount() }}</ion-badge>
          }
        </ion-tab-button>

        <ion-tab-button tab="tables" href="/tabs/tables">
          <ion-icon name="apps"></ion-icon>
          <ion-label>Mesas</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge]
})
export class TabsPage {
  public orderService = inject(OrderService);
  
  constructor() {
    addIcons({ book, calculator, apps });
  }
}
