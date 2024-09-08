import {Entity, model, property, hasMany} from '@loopback/repository';
import {DetailAccount} from './detail-account.model';

@model()
export class Account extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    default: 0,
  })
  idCustomer?: number;

  @property({
    type: 'string',
    required: true,
  })
  nameCustomer: string;

  @property({
    type: 'number',
    default: 0,
  })
  totalValue?: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    default: 0,
  })
  state?: number;

  @property({
    type: 'number',
    default: 0,
  })
  pendingValue?: number;

  @property({
    type: 'number',
    default: 0,
  })
  paidValue?: number;

  @property({
    type: 'any',
  })
  observations?: any;

  @property({
    type: 'boolean',
    default: 0,
  })
  eliminated?: boolean;

  @property({
    type: 'number',
  })
  workShiftId?: number;

  @hasMany(() => DetailAccount)
  detailAccounts: DetailAccount[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
