import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Subcategory } from '../models/subcategory.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService extends BaseService<Subcategory> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.SUBCATEGORY;
  }
}
