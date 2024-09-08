import {Entity, model, property, hasMany} from '@loopback/repository';
import {Account} from './account.model';

@model()
export class WorkShift extends Entity {
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
  attendant: string;

  @property({
    type: 'number',
    required: true,
  })
  initialCash: number;

  @property({
    type: 'number',
    default: 0,
  })
  cashPayments?: number;

  @property({
    type: 'number',
    default: 0,
  })
  transferPayments?: number;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  @property({
    type: 'number',
    required: true,
  })
  cashClosing: number;

  @property({
    type: 'number',
    default: 0,
  })
  cashExpenses?: number;

  @property({
    type: 'number',
    default: 0,
  })
  transferExpenses?: number;

  @property({
    type: 'any',
  })
  openingObservations?: any;

  @property({
    type: 'any',
  })
  closingObservations?: any;

  @hasMany(() => Account)
  accounts: Account[];

  constructor(data?: Partial<WorkShift>) {
    super(data);
  }
}

export interface WorkShiftRelations {
  // describe navigational properties here
}

export type WorkShiftWithRelations = WorkShift & WorkShiftRelations;
