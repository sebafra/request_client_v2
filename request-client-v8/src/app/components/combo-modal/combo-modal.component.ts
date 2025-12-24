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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonFooter,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, checkmark, layers } from 'ionicons/icons';
import { ComboService } from '../../core/services/combo.service';
import { ComboArticleService } from '../../core/services/combo-article.service';
import { Combo } from '../../core/models/combo.interface';
import { ComboArticle } from '../../core/models/combo-article.interface';

@Component({
  selector: 'app-combo-modal',
  templateUrl: './combo-modal.component.html',
  styleUrls: ['./combo-modal.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonFooter,
    IonToolbar
  ]
})
export class ComboModalComponent implements OnInit {
  @Input() article: any;
  @Input() comboIndex: number = 0; // Índice del combo en el array combos[]
  
  private comboService = inject(ComboService);
  private comboArticleService = inject(ComboArticleService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  isBusy: boolean = false;
  groups: Combo | null = null;
  comboArticles: ComboArticle[] = [];
  
  group_1: ComboArticle[] = [];
  group_2: ComboArticle[] = [];
  group_3: ComboArticle[] = [];
  group_4: ComboArticle[] = [];
  group_5: ComboArticle[] = [];
  
  group_val_1: string[] = [];
  group_val_2: string[] = [];
  group_val_3: string[] = [];
  group_val_4: string[] = [];
  group_val_5: string[] = [];

  constructor() {
    addIcons({ close, checkmark, layers });
  }

  ngOnInit() {
    this.isBusy = true;
    this.loadGroups();
  }

  loadGroups() {
    if (!this.article?.id) {
      this.isBusy = false;
      return;
    }

    this.comboService.getById(this.article.id).subscribe({
      next: (data) => {
        this.groups = data;
        this.loadCombos();
      },
      error: (err) => {
        console.error('Error loading combo groups:', err);
        this.showError('Error al cargar los grupos del combo');
        this.isBusy = false;
      }
    });
  }

  loadCombos() {
    if (!this.article?.id) {
      this.isBusy = false;
      return;
    }

    this.comboArticleService.getByComboId(this.article.id).subscribe({
      next: (data) => {
        this.comboArticles = data;
        this.processComboData(this.comboArticles);
        
        // Cargar valores existentes si el combo ya tiene combo_detail
        if (this.article.combo_detail && Array.isArray(this.article.combo_detail)) {
          this.loadExistingComboDetail();
        }
      },
      error: (err) => {
        console.error('Error loading combo articles:', err);
        this.showError('Error al cargar los artículos del combo');
        this.isBusy = false;
      }
    });
  }

  processComboData(array: ComboArticle[]) {
    this.group_1 = array.filter(item => item.group === 1);
    this.group_2 = array.filter(item => item.group === 2);
    this.group_3 = array.filter(item => item.group === 3);
    this.group_4 = array.filter(item => item.group === 4);
    this.group_5 = array.filter(item => item.group === 5);
    
    // Group 1: todos los artículos están seleccionados por defecto
    this.group_val_1 = this.group_1.map(item => item.article_id);
    
    this.isBusy = false;
  }

  loadExistingComboDetail() {
    // Cargar los valores ya seleccionados desde combo_detail
    const detail = this.article.combo_detail;
    
    // Resetear valores
    this.group_val_2 = [];
    this.group_val_3 = [];
    this.group_val_4 = [];
    this.group_val_5 = [];
    
    // Agrupar por combo_group
    const grouped: { [key: number]: string[] } = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    
    detail.forEach((item: any) => {
      const group = item.combo_group || 1;
      if (grouped[group]) {
        grouped[group].push(item.article_id);
      }
    });
    
    this.group_val_2 = grouped[2];
    this.group_val_3 = grouped[3];
    this.group_val_4 = grouped[4];
    this.group_val_5 = grouped[5];
  }

  validateType(obj: any): string[] {
    if (typeof obj === 'string') {
      return [obj];
    } else if (Array.isArray(obj)) {
      return obj;
    }
    return [];
  }

  async processCombo() {
    // Group 1 siempre tiene todos los artículos
    const arr: string[][] = [
      this.group_val_1,
      this.validateType(this.group_val_2),
      this.validateType(this.group_val_3),
      this.validateType(this.group_val_4),
      this.validateType(this.group_val_5)
    ];

    // Validar que al menos haya algo seleccionado
    if (arr[0].length === 0 && arr[1].length === 0 && arr[2].length === 0 && 
        arr[3].length === 0 && arr[4].length === 0) {
      this.showError('Debe cargar algún componente del combo para continuar');
      return;
    }

    // Obtener configuración COMBO_COMPLETE
    const comboComplete = localStorage.getItem('REQUEST_COMBO_COMPLETE') || 'false';

    // Validaciones según COMBO_COMPLETE (igual que legacy)
    if (comboComplete === 'true') {
      // Debe seleccionar exactamente la cantidad requerida
      // Si group_X_ud = 0, valida que no se seleccione nada (arr[X].length debe ser 0)
      if (this.groups && arr[1].length !== this.groups.group_2_ud) {
        this.showError(`Debe seleccionar ${this.groups.group_2_ud} ud en ${this.groups.group_2_name}`);
        return;
      }
      if (this.groups && arr[2].length !== this.groups.group_3_ud) {
        this.showError(`Debe seleccionar ${this.groups.group_3_ud} ud en ${this.groups.group_3_name}`);
        return;
      }
      if (this.groups && arr[3].length !== this.groups.group_4_ud) {
        this.showError(`Debe seleccionar ${this.groups.group_4_ud} ud en ${this.groups.group_4_name}`);
        return;
      }
      if (this.groups && arr[4].length !== this.groups.group_5_ud) {
        this.showError(`Debe seleccionar ${this.groups.group_5_ud} ud en ${this.groups.group_5_name}`);
        return;
      }
    } else {
      // Puede seleccionar hasta la cantidad máxima
      if (this.groups && arr[1].length > this.groups.group_2_ud) {
        this.showError(`Solo puede cargar ${this.groups.group_2_ud} ud en ${this.groups.group_2_name}`);
        return;
      }
      if (this.groups && arr[2].length > this.groups.group_3_ud) {
        this.showError(`Solo puede cargar ${this.groups.group_3_ud} ud en ${this.groups.group_3_name}`);
        return;
      }
      if (this.groups && arr[3].length > this.groups.group_4_ud) {
        this.showError(`Solo puede cargar ${this.groups.group_4_ud} ud en ${this.groups.group_4_name}`);
        return;
      }
      if (this.groups && arr[4].length > this.groups.group_5_ud) {
        this.showError(`Solo puede cargar ${this.groups.group_5_ud} ud en ${this.groups.group_5_name}`);
        return;
      }
    }

    this.saveCombo(arr);
  }

  saveCombo(arr: string[][]) {
    const comboDetail: any[] = [];

    for (let i = 0; i < arr.length; i++) {
      arr[i].forEach(articleId => {
        const articleName = this.getName(articleId);
        comboDetail.push({
          name: articleName,
          article_id: articleId,
          combo: this.article.id,
          combo_group: i + 1
        });
      });
    }

    // Retornar el combo_detail para que OrderService lo actualice
    this.modalCtrl.dismiss({ comboDetail });
  }

  getName(articleId: string): string {
    const item = this.comboArticles.find(ca => ca.article_id === articleId);
    return item?.article?.name || '';
  }

  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}

