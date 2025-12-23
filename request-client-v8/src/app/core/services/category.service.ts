import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Category } from '../models/category.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.CATEGORY;
  }
}
