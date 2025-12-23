import { BaseEntity } from './base.interface';

export interface Order extends BaseEntity {
  status: string;
  total: number;
  table?: any; // Definir tipo Table
  items?: any[];
  // Agregar más propiedades según se descubran
}
