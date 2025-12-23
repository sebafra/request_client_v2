import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Waiter } from '../models/waiter.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class WaiterService extends BaseService<Waiter> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.WAITER;
  }

  /**
   * Logout - Clears waiter session from localStorage
   */
  logout(): void {
    localStorage.removeItem('REQUEST_WAITER');
    // Also clear cart if needed when user logs out
    // OrderService could handle this via injection if needed
  }
}
