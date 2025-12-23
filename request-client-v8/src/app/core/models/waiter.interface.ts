import { BaseEntity } from './base.interface';

export interface Waiter extends BaseEntity {
  name: string;
  code: string;
}
