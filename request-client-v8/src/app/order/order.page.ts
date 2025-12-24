import { Component, inject, ViewEncapsulation } from '@angular/core';
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
  IonChip,
  IonFab, 
  IonFabButton, 
  ActionSheetController, 
  AlertController, 
  LoadingController, 
  ToastController, 
  NavController,
  ModalController
} from '@ionic/angular/standalone';
import { OrderService } from '../core/services/order.service';
import { PreferenceModalComponent } from '../components/preference-modal/preference-modal.component';
import { ComboModalComponent } from '../components/combo-modal/combo-modal.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmark, notifications, trash, ellipsisHorizontal, cartOutline, receiptOutline, layers } from 'ionicons/icons';

@Component({
  selector: 'app-order',
  templateUrl: 'order.page.html',
  styleUrls: ['order.page.scss'],
  encapsulation: ViewEncapsulation.None,
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
    IonChip,
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
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ checkmark, notifications, trash, ellipsisHorizontal, cartOutline, receiptOutline, layers });
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getPreferenceText(preferences: any[]): string {
    if (!preferences || preferences.length === 0) return '';
    return preferences
      .filter((p: any) => p.selected !== false)
      .map((p: any) => p.description || p)
      .join(', ');
  }

  async confirmClearCart() {
    const alert = await this.alertCtrl.create({
      header: 'Borrar Pedido',
      message: '¿Está seguro que desea borrar todos los artículos del pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.orderService.clearCart();
          }
        }
      ]
    });
    await alert.present();
  }

  async showOptions(item: any, index: number, comboIndex?: number) {
    const buttons: any[] = [
      {
        text: 'Agregar Preferencia',
        icon: 'notifications',
        handler: () => {
          this.addPreference(item, index);
        }
      }
    ];

    // Si es un combo sin combo_detail, agregar opción para editar
    if (item.combo && !item.combo_detail && comboIndex !== undefined) {
      buttons.push({
        text: 'Detalle del Combo',
        icon: 'layers',
        handler: () => {
          this.showCombo(item, index, comboIndex);
        }
      });
    }

    // Si es un combo con combo_detail, agregar opción para ver componentes
    if (item.combo && item.combo_detail && Array.isArray(item.combo_detail)) {
      buttons.push({
        text: 'Ver Componentes',
        icon: 'layers',
        handler: () => {
          this.viewComboComponents(item);
        }
      });
    }

    buttons.push({
      text: 'Eliminar del pedido',
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        if (comboIndex !== undefined) {
          // Eliminar combo específico
          this.orderService.removeComboByIndex(index, comboIndex);
        } else {
          // Eliminar artículo completo
          this.orderService.removeItemByIndex(index);
        }
      }
    });

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: item.name,
      buttons
    });
    await actionSheet.present();
  }

  async addPreference(item: any, index: number) {
    const modal = await this.modalCtrl.create({
      component: PreferenceModalComponent,
      componentProps: {
        article: item
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      // data es un array de preferencias seleccionadas
      // Convertir a string para compatibilidad con el backend (como en legacy)
      const preferenceString = data.map((p: any) => p.description).join(',');
      this.orderService.updateItemPreference(index, data);
    }
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

  async showCombo(item: any, itemIndex: number, comboIndex: number) {
    const modal = await this.modalCtrl.create({
      component: ComboModalComponent,
      componentProps: {
        article: item,
        comboIndex: comboIndex
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data && data.comboDetail) {
      this.orderService.updateComboDetail(itemIndex, comboIndex, data.comboDetail);
    }
  }

  async viewComboComponents(item: any) {
    if (!item.combo_detail || !Array.isArray(item.combo_detail)) {
      return;
    }

    // Construir mensaje con saltos de línea (el alert no interpreta HTML)
    const components = item.combo_detail.map((component: any) => 
      `• ${component.name || component.article_id}`
    ).join('\n');

    const alert = await this.alertCtrl.create({
      header: 'Componentes del Combo',
      message: components,
      buttons: ['Cerrar'],
      cssClass: 'combo-components-alert'
    });
    await alert.present();
  }

  processComboPreferences(preferences: any): string {
    if (!preferences) return '';
    
    if (typeof preferences === 'string') {
      return preferences;
    } else if (Array.isArray(preferences)) {
      return preferences
        .filter((p: any) => p.selected !== false)
        .map((p: any) => p.description || p)
        .join(',');
    }
    return '';
  }

  async processOrderSending(data: any) {
    const loader = await this.loadingCtrl.create({ message: 'Enviando pedido...' });
    await loader.present();

    const waiterJson = localStorage.getItem('REQUEST_WAITER');
    const waiter = waiterJson ? JSON.parse(waiterJson) : null;
    const waiterId = waiter ? waiter.id : 1; // Fallback to 1 if testing

    const promises: Promise<any>[] = [];
    const cartItems = this.orderService.cart();

    // Iterar sobre items del carrito
    for (let index = 0; index < cartItems.length; index++) {
      const item = cartItems[index];

      // Si es un combo
      if (item.combo && item.combos && Array.isArray(item.combos)) {
        const combos = item.combos;
        
        for (let n = 0; n < combos.length; n++) {
          const combo = combos[n];
          
          // Validar que tenga combo_detail
          if (!combo.combo_detail || !Array.isArray(combo.combo_detail) || combo.combo_detail.length === 0) {
            await loader.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Debe completar todos los combos antes de enviar',
              duration: 3000,
              position: 'top',
              color: 'danger'
            });
            await toast.present();
            return;
          }

          // Crear número negativo único para combo_item
          const comboItem = -Math.abs(index) - (n + 1);

          // Crear cabecera del combo
          const comboHeader = {
            table: data.table,
            waiter: waiterId,
            code: combo.id,
            description: combo.name,
            quantity: 1,
            preference: this.processComboPreferences(combo.preference),
            combo: combo.id,
            combo_item: comboItem
          };
          promises.push(this.orderService.create(comboHeader as any).toPromise());

          // Crear componentes del combo
          for (let i = 0; i < combo.combo_detail.length; i++) {
            const component = combo.combo_detail[i];
            const componentPayload = {
              table: data.table,
              waiter: waiterId,
              code: component.article_id,
              description: '**' + component.name,
              quantity: 1,
              preference: '',
              combo: component.combo,
              combo_item: comboItem,
              combo_group: component.combo_group
            };
            promises.push(this.orderService.create(componentPayload as any).toPromise());
          }
        }
      } else {
        // Artículo normal
        let preferenceString = '';
        if (item.preference) {
          if (typeof item.preference === 'string') {
            preferenceString = item.preference;
          } else if (Array.isArray(item.preference)) {
            preferenceString = item.preference
              .filter((p: any) => p.selected !== false)
              .map((p: any) => p.description || p)
              .join(',');
          }
        }
        
        const payload = {
          table: data.table,
          waiter: waiterId,
          code: item.id,
          description: item.name,
          quantity: item.quantity,
          preference: preferenceString
        };
        promises.push(this.orderService.create(payload as any).toPromise());
      }
    }

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
