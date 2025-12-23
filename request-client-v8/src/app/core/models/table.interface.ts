import { BaseEntity } from './base.interface';

export interface Table extends BaseEntity {
  number: string;
  status: string;
  total?: number;
  people?: number;
  prefac?: boolean;
  waiter?: any;
}
