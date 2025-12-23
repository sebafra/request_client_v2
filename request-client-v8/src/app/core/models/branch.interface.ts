import { BaseEntity } from './base.interface';

export interface Branch extends BaseEntity {
  name: string;
  address?: string;
}
