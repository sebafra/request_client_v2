import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonListHeader, 
  IonLabel, 
  IonItem, 
  IonIcon, 
  IonInput, 
  IonNote, 
  IonButton, 
  IonToggle,
  ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wifi, moon, sunny, mail } from 'ionicons/icons';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonListHeader, 
    IonLabel, 
    IonItem, 
    IonIcon, 
    IonInput, 
    IonNote, 
    IonButton, 
    IonToggle
  ]
})
export class SettingsPage implements OnInit {
  private toastCtrl = inject(ToastController);
  public themeService = inject(ThemeService);

  ipAddress = '';
  // darkMode handled by themeService
  comboComplete = false;
  
  // TODO: Move to config service
  currentIp = '';

  constructor() {
    addIcons({ wifi, moon, sunny, mail });
  }

  ngOnInit() {
    this.currentIp = localStorage.getItem('REQUEST_IP') || '';
    this.comboComplete = localStorage.getItem('REQUEST_COMBO_COMPLETE') === 'true';
    this.ipAddress = this.currentIp;
  }

  saveIp() {
    if (this.ipAddress && this.ipAddress.length >= 7) {
      localStorage.setItem('REQUEST_IP', this.ipAddress);
      this.currentIp = this.ipAddress;
      // TODO: Update API URL in global config
      this.presentToast('IP Guardada correctamente');
    } else {
      this.presentToast('IP Inválida', 'danger');
    }
  }

  toggleDarkMode(event: any) {
    this.themeService.toggleTheme(event.detail.checked);
  }

  toggleComboSetting() {
    localStorage.setItem('REQUEST_COMBO_COMPLETE', String(this.comboComplete));
  }

  async presentToast(msg: string, color: 'success' | 'danger' | 'primary' = 'success') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
