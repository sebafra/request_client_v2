import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Table } from '../models/table.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TableService extends BaseService<Table> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.TABLE;
  }
}
