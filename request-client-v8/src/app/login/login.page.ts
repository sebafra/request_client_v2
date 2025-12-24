import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonInput, 
  IonButton, 
  IonText, 
  IonFooter,
  NavController, 
  AlertController, 
  ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, key, settings } from 'ionicons/icons';
import { WaiterService } from '../core/services/waiter.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-content" [fullscreen]="true">
      <div class="login-bg"></div>
      
      <ion-grid class="logo-container">
        <ion-row class="ion-margin-bottom ion-margin-top">
          <ion-col size="8" offset="2" class="ion-text-center">
            <img src="assets/imgs/logo.png" alt="Logo" class="logo-img">
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="login-container ion-padding">
        <ion-list class="transparent-list">
            <ion-item lines="none" class="input-item ion-margin-top">
                <ion-icon slot="start" name="person" color="primary"></ion-icon>
                <ion-input 
                    type="number" 
                    placeholder="Ingrese Nº de vendedor" 
                    [(ngModel)]="username"
                    (keyup.enter)="login()">
                </ion-input>
            </ion-item>
        </ion-list>
        
        <div class="ion-padding-top ion-padding-bottom"></div>
        
        <ion-button expand="block" (click)="login()">Iniciar Sesión</ion-button>
        
        <div class="ion-padding-top ion-padding-bottom"></div>

        <ion-button fill="clear" expand="block" (click)="goToSettings()">
            <ion-icon slot="start" name="settings" color="medium"></ion-icon>
            <ion-text color="medium">Opciones de Configuración</ion-text>
        </ion-button>
      </div>
    </ion-content>
    
    <ion-footer class="ion-no-border transparent-footer">
        <ion-grid>
        <ion-row>
            <ion-col size="8" offset="2" class="ion-text-center">
                <ion-text color="dark">v{{version}}</ion-text>
            </ion-col>
        </ion-row>
        </ion-grid>
    </ion-footer>
  `,
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonInput, 
    IonButton, 
    IonText, 
    IonFooter
  ]
})
export class LoginPage {
  username = '';
  version = '1.0.0'; // Should ideally come from constants
  password = ''; // Legacy didn't use password for waiter login, just ID
  private navCtrl = inject(NavController);

  private waiterService = inject(WaiterService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ person, key, settings });
  }

  goToSettings() {
    this.navCtrl.navigateForward('/settings');
  }

  login() {
    if (!this.username) {
      this.presentToast('Ingrese un número de mozo', 'warning');
      return;
    }

    // Legacy logic: Login by ID (waiter number)
    const filters = { id: this.username }; 
    
    this.waiterService.getAll(filters).subscribe({
      next: (waiters) => {
        if (waiters && waiters.length > 0) {
          const waiter = waiters[0];
          localStorage.setItem('REQUEST_WAITER', JSON.stringify(waiter));
          this.presentToast(`Bienvenido ${waiter.name || 'Mozo'}`);
          this.navCtrl.navigateRoot('/tabs/home');
        } else {
          this.showAlert('Error', 'Mozo no encontrado');
        }
      },
      error: (err) => {
        console.error('Login error', err);
        this.showAlert('Error de Conexión', 'No se pudo conectar con el servidor');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
