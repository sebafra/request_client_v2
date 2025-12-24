import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, add, documentText } from 'ionicons/icons';
import { PreferenceService } from '../../core/services/preference.service';

interface PreferenceItem {
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-preference-modal',
  templateUrl: './preference-modal.component.html',
  styleUrls: ['./preference-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner
  ]
})
export class PreferenceModalComponent implements OnInit {
  @Input() article: any;
  
  private preferenceService = inject(PreferenceService);
  private modalCtrl = inject(ModalController);

  customPreference: string = '';
  preferences: PreferenceItem[] = [];
  isLoading = false;

  constructor() {
    addIcons({ close, add, documentText });
  }

  ngOnInit() {
    // Si el artículo ya tiene preferencias, usarlas
    if (this.article?.preference) {
      // Si es un string, convertirlo a array
      if (typeof this.article.preference === 'string') {
        this.preferences = this.article.preference.split(',').map((desc: string) => ({
          description: desc.trim(),
          selected: true
        }));
      } else if (Array.isArray(this.article.preference)) {
        // Si ya es un array, usarlo directamente
        this.preferences = this.article.preference.map((pref: any) => {
          if (typeof pref === 'string') {
            return { description: pref, selected: true };
          }
          return { description: pref.description || pref, selected: pref.selected !== false };
        });
      }
    } else {
      // Cargar preferencias del servidor
      this.loadPreferences();
    }
  }

  loadPreferences() {
    if (!this.article?.id) return;
    
    this.isLoading = true;
    this.preferenceService.getByArticleId(this.article.id).subscribe({
      next: (prefs) => {
        // El servidor devuelve un array de preferencias
        // Cada preferencia tiene una propiedad 'description'
        this.preferences = prefs.map((pref: any) => ({
          description: pref.description || pref.name || String(pref),
          selected: false
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading preferences:', err);
        this.preferences = [];
        this.isLoading = false;
      }
    });
  }

  addPreference() {
    const trimmed = this.customPreference.trim();
    if (trimmed.length > 0) {
      // Verificar si ya existe
      const exists = this.preferences.some(p => p.description.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        this.preferences.push({
          description: trimmed,
          selected: true
        });
        this.customPreference = '';
      }
    }
  }

  selectPreference(item: PreferenceItem) {
    item.selected = !item.selected;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addPreference();
    }
  }

  dismiss() {
    // Filtrar solo las preferencias seleccionadas
    const selectedPreferences = this.preferences.filter(p => p.selected);
    this.modalCtrl.dismiss(selectedPreferences);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}

