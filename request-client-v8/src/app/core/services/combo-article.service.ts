import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ComboArticle } from '../models/combo-article.interface';

@Injectable({
  providedIn: 'root'
})
export class ComboArticleService extends BaseService<ComboArticle> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.COMBO_ARTICLES;
  }

  // Override getById to get by combo_id (not article id)
  // This returns an array, not a single item
  getByComboId(comboId: string | number): Observable<ComboArticle[]> {
    // The API endpoint /combo_articles/:id returns articles for that combo_id
    return this.http.get<ComboArticle[]>(`${this.getFullUrl()}/${comboId}`).pipe(
      catchError(this.handleError)
    );
  }
}
