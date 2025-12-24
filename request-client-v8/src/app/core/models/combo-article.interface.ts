import { BaseEntity } from './base.interface';
import { Article } from './article.interface';

export interface ComboArticle extends BaseEntity {
  combo_id: string;
  group: number; // 1-5
  disabled: boolean;
  article_id: string;
  article?: Article; // Populated from backend
}

