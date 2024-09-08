import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  WorkShift,
  Account,
} from '../models';
import {WorkShiftRepository} from '../repositories';

export class WorkShiftAccountController {
  constructor(
    @repository(WorkShiftRepository) protected workShiftRepository: WorkShiftRepository,
  ) { }

  @get('/work-shifts/{id}/accounts', {
    responses: {
      '200': {
        description: 'Array of WorkShift has many Account',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.workShiftRepository.accounts(id).find(filter);
  }

  @post('/work-shifts/{id}/accounts', {
    responses: {
      '200': {
        description: 'WorkShift model instance',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof WorkShift.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccountInWorkShift',
            exclude: ['id'],
            optional: ['workShiftId']
          }),
        },
      },
    }) account: Omit<Account, 'id'>,
  ): Promise<Account> {
    return this.workShiftRepository.accounts(id).create(account);
  }

  @patch('/work-shifts/{id}/accounts', {
    responses: {
      '200': {
        description: 'WorkShift.Account PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Partial<Account>,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.workShiftRepository.accounts(id).patch(account, where);
  }

  @del('/work-shifts/{id}/accounts', {
    responses: {
      '200': {
        description: 'WorkShift.Account DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.workShiftRepository.accounts(id).delete(where);
  }
}
