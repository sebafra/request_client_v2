import { BaseEntity } from './base.interface';

export interface Category extends BaseEntity {
  name: string;
  icon?: string;
  image?: string;
  order?: number;
}
