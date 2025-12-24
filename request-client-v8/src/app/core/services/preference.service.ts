import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Preference } from '../models/preference.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService extends BaseService<Preference> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.PREFERENCE;
  }

  /**
   * Obtiene las preferencias precargadas para un artículo específico
   * @param code ID del artículo
   * @returns Observable con array de preferencias
   */
  getByArticleId(code: string | number): Observable<Preference[]> {
    return this.http.get<Preference[]>(`${this.getFullUrl()}/${code}`).pipe(
      catchError(this.handleError)
    );
  }
}
