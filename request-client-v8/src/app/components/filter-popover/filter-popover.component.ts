import { Component, Input } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonIcon, PopoverController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-filter-popover',
  template: `
    <ion-list>
      <ion-list-header>Subcategorías</ion-list-header>
      <ion-item button (click)="select(null)" [color]="!selectedSubcategory ? 'primary' : ''">
        <ion-label>Todas</ion-label>
        @if (!selectedSubcategory) {
          <ion-icon name="checkmark" slot="end" color="primary"></ion-icon>
        }
      </ion-item>
      <ion-item button *ngFor="let subnet of subcategories" (click)="select(subnet)" [color]="isSelected(subnet) ? 'primary' : ''">
        <ion-label>{{ subnet.name }}</ion-label>
        @if (isSelected(subnet)) {
          <ion-icon name="checkmark" slot="end" color="primary"></ion-icon>
        }
      </ion-item>
    </ion-list>
  `,
  standalone: true,
  imports: [CommonModule, IonList, IonListHeader, IonItem, IonLabel, IonIcon]
})
export class FilterPopoverComponent {
  @Input() subcategories: any[] = [];
  @Input() selectedSubcategory: any | null = null;

  constructor(private popoverCtrl: PopoverController) {
    addIcons({ checkmark });
  }

  isSelected(subcategory: any): boolean {
    if (!this.selectedSubcategory || !subcategory) return false;
    return this.selectedSubcategory.id === subcategory.id;
  }

  select(item: any) {
    this.popoverCtrl.dismiss(item);
  }
}
