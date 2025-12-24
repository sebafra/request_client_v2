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
        // Si es un combo, agregar una nueva instancia al array combos[]
        if (article.combo) {
          const newCombo = {
            ...article,
            quantity: 1,
            order_number: (existing.combos?.length || 0) + 1,
            combo_detail: null
          };
          return items.map(i => {
            if (i.id === article.id) {
              return {
                ...i,
                quantity: (i.quantity || 0) + 1,
                combos: [...(i.combos || []), newCombo]
              };
            }
            return i;
          });
        } else {
          // Artículo normal: incrementar cantidad
          return items.map(i => i.id === article.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i);
        }
      } else {
        // Nuevo artículo
        if (article.combo) {
          // Crear estructura de combo con primera instancia
          return [...items, {
            ...article,
            quantity: 1,
            combos: [{
              ...article,
              quantity: 1,
              order_number: 1,
              combo_detail: null
            }]
          }];
        } else {
          // Artículo normal
          return [...items, { ...article, quantity: 1 }];
        }
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

  removeItemByIndex(index: number) {
    this._cartItems.update(items => {
      if (index < 0 || index >= items.length) return items;
      
      const item = items[index];
      
      // Si es un combo, necesitamos el comboIndex también
      // Por ahora, eliminamos el último combo del array
      if (item.combo && item.combos && item.combos.length > 0) {
        const newCombos = [...item.combos];
        newCombos.pop(); // Eliminar último combo
        
        if (newCombos.length === 0) {
          // Si no quedan combos, eliminar el artículo completo
          return items.filter((_, idx) => idx !== index);
        } else {
          // Actualizar cantidad y combos
          return items.map((i, idx) => 
            idx === index 
              ? { ...i, quantity: newCombos.length, combos: newCombos }
              : i
          );
        }
      } else if (item.quantity > 1) {
        // Artículo normal: reducir cantidad
        return items.map((i, idx) => idx === index ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        // Eliminar artículo completo
        return items.filter((_, idx) => idx !== index);
      }
    });
  }

  removeComboByIndex(itemIndex: number, comboIndex: number) {
    this._cartItems.update(items => {
      if (itemIndex < 0 || itemIndex >= items.length) return items;
      
      const item = items[itemIndex];
      if (!item.combo || !item.combos) return items;
      
      const newCombos = item.combos.filter((_: any, idx: number) => idx !== comboIndex);
      
      if (newCombos.length === 0) {
        // Si no quedan combos, eliminar el artículo completo
        return items.filter((_: any, idx: number) => idx !== itemIndex);
      } else {
        // Actualizar cantidad y combos
        return items.map((i, idx) => 
          idx === itemIndex 
            ? { ...i, quantity: newCombos.length, combos: newCombos }
            : i
        );
      }
    });
  }

  updateComboDetail(itemIndex: number, comboIndex: number, comboDetail: any[]) {
    this._cartItems.update(items => {
      if (itemIndex < 0 || itemIndex >= items.length) return items;
      
      const item = items[itemIndex];
      if (!item.combo || !item.combos || comboIndex < 0 || comboIndex >= item.combos.length) {
        return items;
      }
      
      return items.map((i, idx) => {
        if (idx === itemIndex) {
          const updatedCombos = [...i.combos];
          updatedCombos[comboIndex] = {
            ...updatedCombos[comboIndex],
            combo_detail: comboDetail
          };
          return {
            ...i,
            combos: updatedCombos
          };
        }
        return i;
      });
    });
  }

  updateItemPreference(index: number, preference: any) {
    this._cartItems.update(items => {
      if (index < 0 || index >= items.length) return items;
      return items.map((item, idx) => 
        idx === index ? { ...item, preference } : item
      );
    });
  }
  
  clearCart() {
    this._cartItems.set([]);
  }
}
