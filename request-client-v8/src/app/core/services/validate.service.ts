import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../constants/api.constants';

// Validate parece ser un endpoint especial, tal vez no CRUD.
// Por ahora heredamos BaseService con any, pero podríamos personalizarlo.
@Injectable({
  providedIn: 'root'
})
export class ValidateService extends BaseService<any> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.VALIDATE;
  }

  // Ejemplo de método custom
  validateCode(code: string) {
    return this.http.post(this.getFullUrl(), { code });
  }
}
