import { BaseEntity } from './base.interface';

export interface Article extends BaseEntity {
  name: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: number | string;
  subcategoryId?: number | string;
  combo?: boolean;
}

// base.interface.ts debe existir o importarse de base.service si se exportó allí. 
// Para limpieza, moveré BaseEntity a su propio archivo.
