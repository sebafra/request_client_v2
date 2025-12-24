import { BaseEntity } from './base.interface';

export interface Combo extends BaseEntity {
  name: string;
  price: number;
  articles: any[];
  group_1_name: string;
  group_1_ud: number;
  group_2_name: string;
  group_2_ud: number;
  group_3_name: string;
  group_3_ud: number;
  group_4_name: string;
  group_4_ud: number;
  group_5_name: string;
  group_5_ud: number;
}
