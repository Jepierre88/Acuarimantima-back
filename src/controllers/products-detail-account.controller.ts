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
  Products,
  DetailAccount,
} from '../models';
import {ProductsRepository} from '../repositories';

export class ProductsDetailAccountController {
  constructor(
    @repository(ProductsRepository) protected productsRepository: ProductsRepository,
  ) { }

  @get('/products/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Array of Products has many DetailAccount',
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
    return this.productsRepository.detailAccounts(id).find(filter);
  }

  @post('/products/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Products model instance',
        content: {'application/json': {schema: getModelSchemaRef(DetailAccount)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Products.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetailAccount, {
            title: 'NewDetailAccountInProducts',
            exclude: ['id'],
            optional: ['productsId']
          }),
        },
      },
    }) detailAccount: Omit<DetailAccount, 'id'>,
  ): Promise<DetailAccount> {
    return this.productsRepository.detailAccounts(id).create(detailAccount);
  }

  @patch('/products/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Products.DetailAccount PATCH success count',
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
    return this.productsRepository.detailAccounts(id).patch(detailAccount, where);
  }

  @del('/products/{id}/detail-accounts', {
    responses: {
      '200': {
        description: 'Products.DetailAccount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DetailAccount)) where?: Where<DetailAccount>,
  ): Promise<Count> {
    return this.productsRepository.detailAccounts(id).delete(where);
  }
}
