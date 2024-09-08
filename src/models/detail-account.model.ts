import {Entity, model, property} from '@loopback/repository';

@model()
export class DetailAccount extends Entity {
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
  nameProduct: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'number',
    default: 0,
  })
  discountValue?: number;

  @property({
    type: 'number',
    default: 0,
  })
  discountPercentage?: number;

  @property({
    type: 'number',
    default: 0,
  })
  payValue?: number;

  @property({
    type: 'number',
    default: 0,
  })
  statusPayment?: number;

  @property({
    type: 'number',
  })
  accountId?: number;

  @property({
    type: 'number',
  })
  productsId?: number;

  constructor(data?: Partial<DetailAccount>) {
    super(data);
  }
}

export interface DetailAccountRelations {
  // describe navigational properties here
}

export type DetailAccountWithRelations = DetailAccount & DetailAccountRelations;
