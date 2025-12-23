import { Injectable, signal, computed } from '@angular/core';
import { BaseService } from './base.service';
import { Order } from '../models/order.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order> {
  // Estado reactivo del carrito local
  private _cartItems = signal<any[]>([]); // TODO: Definir interfaz ComboItem/ArticleItem

  // Señales públicas de lectura
  public cart = this._cartItems.asReadonly();
  public cartCount = computed(() => this._cartItems().reduce((acc, item) => acc + (item.quantity || 0), 0));
  public cartTotal = computed(() => this._cartItems().reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0));

  protected getEndpoint(): string {
    return API_ENDPOINTS.ORDER;
  }

  addToCart(article: any) {
    this._cartItems.update(items => {
      const existing = items.find(i => i.id === article.id);
      if (existing) {
        return items.map(i => i.id === article.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i);
      } else {
        return [...items, { ...article, quantity: 1 }];
      }
    });
  }

  removeFromCart(articleId: number | string) {
    this._cartItems.update(items => {
      const existing = items.find(i => i.id === articleId);
      if (!existing) return items;

      if (existing.quantity > 1) {
        return items.map(i => i.id === articleId ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        return items.filter(i => i.id !== articleId);
      }
    });
  }
  
  clearCart() {
    this._cartItems.set([]);
  }
}
