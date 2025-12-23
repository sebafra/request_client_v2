import { Component, Input } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, PopoverController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-popover',
  template: `
    <ion-list>
      <ion-list-header>Subcategorías</ion-list-header>
      <ion-item button (click)="select(null)">
        <ion-label>Todas</ion-label>
      </ion-item>
      <ion-item button *ngFor="let subnet of subcategories" (click)="select(subnet)">
        <ion-label>{{ subnet.name }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  standalone: true,
  imports: [CommonModule, IonList, IonListHeader, IonItem, IonLabel]
})
export class FilterPopoverComponent {
  @Input() subcategories: any[] = [];

  constructor(private popoverCtrl: PopoverController) {}

  select(item: any) {
    this.popoverCtrl.dismiss(item);
  }
}
