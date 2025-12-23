import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Article } from '../models/article.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseService<Article> {
  
  protected getEndpoint(): string {
    return API_ENDPOINTS.ARTICLE;
  }

  // Aquí se puede agregar lógica específica de Artículos si es necesaria
  // Por ahora, hereda todo el CRUD de BaseService
}
