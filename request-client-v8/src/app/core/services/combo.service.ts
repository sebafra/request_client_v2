import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Combo } from '../models/combo.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ComboService extends BaseService<Combo> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.COMBO;
  }
}
