import { BaseEntity } from './base.interface';

export interface Combo extends BaseEntity {
  name: string;
  price: number;
  articles: any[];
}
