import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseEntity } from '../models/base.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends BaseEntity> {
  protected http = inject(HttpClient);
  
  protected abstract getEndpoint(): string;

  protected getServerUrl(): string {
    let storedIp = localStorage.getItem('REQUEST_IP');
    if (storedIp) {
      storedIp = storedIp.trim();
      // Si el usuario ya puso http o https, lo usamos tal cual (pero aseguramos /api si falta)
      if (storedIp.startsWith('http')) {
        return storedIp.endsWith('/api') ? storedIp : `${storedIp}/api`.replace('//api', '/api');
      }
      // Si solo puso la IP, construimos con el puerto default del proyecto
      return `http://${storedIp}:3076/api`;
    }
    return environment.apiUrl || ''; 
  }

  protected getFullUrl(): string {
    return `${this.getServerUrl()}${this.getEndpoint()}`;
  }

  getAll(filters: any = {}, sort: any = { name: 1 }, populates: string[] = []): Observable<T[]> {
    let params = new HttpParams()
      .set('_filters', JSON.stringify(filters))
      .set('_sort', JSON.stringify(sort))
      .set('_populates', JSON.stringify(populates));

    return this.http.get<T[]>(this.getFullUrl(), { params }).pipe(
      tap(items => this.saveLocal(this.getEndpoint(), items)),
      catchError(err => {
        if (err.status === 0) {
          // Offline fallback
          const localItems = this.getLocal(this.getEndpoint());
          return of(localItems);
        }
        return this.handleError(err);
      })
    );
  }

  getById(id: string | number, populates: string[] = []): Observable<T> {
    const params = new HttpParams().set('_populates', JSON.stringify(populates));
    return this.http.get<T>(`${this.getFullUrl()}/${id}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.getFullUrl(), item).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string | number, item: T): Observable<T> {
    return this.http.put<T>(`${this.getFullUrl()}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.getFullUrl()}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Local Storage Helpers
  private saveLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  private getLocal(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  protected handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    let message = 'Unknown error';
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }
    return throwError(() => new Error(message));
  }
}
