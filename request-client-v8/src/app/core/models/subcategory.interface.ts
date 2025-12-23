import { BaseEntity } from './base.interface';

export interface Subcategory extends BaseEntity {
  name: string;
  categoryId?: number | string;
  category?: number | string;
}
