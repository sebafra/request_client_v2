import { BaseEntity } from './base.interface';

export interface Preference extends BaseEntity {
  name: string;
  options?: string[];
}
