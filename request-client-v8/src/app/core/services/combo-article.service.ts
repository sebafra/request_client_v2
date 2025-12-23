import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ComboArticleService extends BaseService<any> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.COMBO_ARTICLES;
  }
}
