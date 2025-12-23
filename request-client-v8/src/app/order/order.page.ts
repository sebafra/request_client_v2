import { Component, inject } from '@angular/core';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonFab, 
  IonFabButton, 
  ActionSheetController, 
  AlertController, 
  LoadingController, 
  ToastController, 
  NavController 
} from '@ionic/angular/standalone';
import { OrderService } from '../core/services/order.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmark, notifications, trash, ellipsisHorizontal, cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order',
  templateUrl: 'order.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonFab, 
    IonFabButton
  ]
})
export class OrderPage {
  public orderService = inject(OrderService);
  private navCtrl = inject(NavController);
  private actionSheetCtrl = inject(ActionSheetController);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ checkmark, notifications, trash, ellipsisHorizontal, cartOutline });
  }

  async showOptions(item: any, index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: item.name,
      buttons: [
        {
          text: 'Agregar Preferencia',
          icon: 'notifications',
          handler: () => {
             this.addPreference(item);
          }
        },
        {
          text: 'Eliminar del pedido',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.orderService.removeFromCart(index);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async addPreference(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Nota para cocina',
      inputs: [
        {
          name: 'preference',
          type: 'text',
          placeholder: 'Ej: Sin sal',
          value: item.preference || ''
        }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Guardar',
          handler: (data) => {
            // TODO: Update item in cart (need to refactor cart storage to be mutable or update via service)
            // For now, assume simple mutation for prototype
            item.preference = data.preference; 
          }
        }
      ]
    });
    await alert.present();
  }

  async sendOrder() {
    if (this.orderService.cartCount() === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Pedido',
      inputs: [
        {
          name: 'table',
          type: 'number',
          placeholder: 'Número de Mesa'
        },
        {
          name: 'people',
          type: 'number',
          placeholder: 'Cantidad de Personas'
        }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Enviar',
          handler: (data) => {
            if (data.table && data.people) {
              this.processOrderSending(data);
              return true;
            } else {
              return false; // Prevent close
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async processOrderSending(data: any) {
    const loader = await this.loadingCtrl.create({ message: 'Enviando pedido...' });
    await loader.present();

    const waiterJson = localStorage.getItem('REQUEST_WAITER');
    const waiter = waiterJson ? JSON.parse(waiterJson) : null;
    const waiterId = waiter ? waiter.id : 1; // Fallback to 1 if testing

    // Legacy logic sends one request per item
    const promises = this.orderService.cart().map(item => {
      // Logic for Combo vs Single Item
      // Simplified for now: Single item logic
      // TODO: Handle combos if item.combo is present (legacy had verify inner logic)
      
      const payload = {
        table: data.table,
        waiter: waiterId,
        code: item.id,
        description: item.name,
        quantity: item.quantity,
        preference: item.preference || ''
        // Legacy handles "combos" by iterating sub-items. V8 OrderService groups them.
        // We need to ensure backend accepts this "single line" or if we need to split.
        // Legacy "arr.push(create(obj))" happens inside a loop over articles.
      };
      return this.orderService.create(payload as any).toPromise(); 
      // Using as any because payload doesn't strictly match Article interface but OrderService<Order> expects Order
      // Order interface should be flexible
    });

    try {
      await Promise.all(promises);
      
      this.orderService.clearCart();
      await loader.dismiss();
      
      const toast = await this.toastCtrl.create({
        message: 'Pedido enviado con éxito',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
      
      // Navigate close or back? Legacy does backToHome
      // this.navCtrl.navigateBack('/tabs/tables'); // Or home
      
    } catch (error) {
      console.error(error);
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Error al enviar pedido',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }
}
