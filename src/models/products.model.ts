import {Entity, model, property, hasMany} from '@loopback/repository';
import {DetailAccount} from './detail-account.model';

@model()
export class Products extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'boolean',
    default: false,
  })
  eliminate?: boolean;

  @hasMany(() => DetailAccount)
  detailAccounts: DetailAccount[];

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
