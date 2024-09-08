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
  Account,
  DetailAccount,
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountDetailAccountController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Array of Account has many DetailAccount',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DetailAccount)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DetailAccount>,
  ): Promise<DetailAccount[]> {
    return this.accountRepository.detailAccounts(id).find(filter);
  }

  @post('/accounts/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {'application/json': {schema: getModelSchemaRef(DetailAccount)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Account.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetailAccount, {
            title: 'NewDetailAccountInAccount',
            exclude: ['id'],
            optional: ['accountId']
          }),
        },
      },
    }) detailAccount: Omit<DetailAccount, 'id'>,
  ): Promise<DetailAccount> {
    return this.accountRepository.detailAccounts(id).create(detailAccount);
  }

  @patch('/accounts/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Account.DetailAccount PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetailAccount, {partial: true}),
        },
      },
    })
    detailAccount: Partial<DetailAccount>,
    @param.query.object('where', getWhereSchemaFor(DetailAccount)) where?: Where<DetailAccount>,
  ): Promise<Count> {
    return this.accountRepository.detailAccounts(id).patch(detailAccount, where);
  }

  @del('/accounts/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Account.DetailAccount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DetailAccount)) where?: Where<DetailAccount>,
  ): Promise<Count> {
    return this.accountRepository.detailAccounts(id).delete(where);
  }
}
