import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Products} from '../models';
import {ProductsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class ProductsController {
  constructor(
    @repository(ProductsRepository)
    public productsRepository : ProductsRepository,
  ) {}

  @authenticate('jwt')
  @post('/products')
  @response(200, {
    description: 'Products model instance',
    content: {'application/json': {schema: getModelSchemaRef(Products)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['id', 'eliminated'],
          }),
        },
      },
    })
    requestproducts: Omit<Products, 'id'>,
  ): Promise<Products> {
      const products= Object.assign(requestproducts,{
        name: requestproducts.name.trim(),
        value: requestproducts.value ?? 0,
        enableTaxes: requestproducts.enableTaxes ?? false,
        taxesPorcentaje: requestproducts.taxesPorcentaje ?? 0,
        eliminated: false
      })
      if (products.name.length < 3) {
        throw new HttpErrors[400](`La extensión del nombre del producto debe ser mayor a 3 caracteres`);
      }
      if (await this.productsRepository.findOne({where:{name: products.name}})) {
        throw new HttpErrors[400](`El nombre de producto ya existe`);
      }
      if (products.enableTaxes && products.taxesPorcentaje == 0){
        throw new HttpErrors[400](`El porcentaje de impuesto debe ser mayor a 0`);
      }
      return this.productsRepository.create(products);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Products model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Products, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<Products[]> {
    return this.productsRepository.find(filter);

    let products = await this.productsRepository.find(filter)

    products = await Promise.all(products.filter(async (e) => {
      return e.eliminated !== true;
    }));

  }

  @get('/products/{id}')
  @response(200, {
    description: 'Products model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Products, {exclude: 'where'}) filter?: FilterExcludingWhere<Products>
  ): Promise<Products> {
    return this.productsRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/products/{id}')
  @response(204, {
    description: 'Products PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
  ): Promise<Products> {
    if (products.enableTaxes) {
      if (!products.taxesPorcentaje ) {
        const resultTaxes= await this.productsRepository.findById(id)
        if(resultTaxes.taxesPorcentaje===0){
          throw new HttpErrors[400](`El porcentaje de impuesto debe ser mayor a 0`);
        }
      } else if(products.taxesPorcentaje===0){
        throw new HttpErrors[400](`El porcentaje de impuesto debe ser mayor a 0`);
      }
    }
    await this.productsRepository.updateById(id, products);
    const result = await this.productsRepository.findById(id)
    return result

  }

  @authenticate('jwt')
  @del('/products/{id}')
  @response(204, {
    description: 'Products DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {

    await this.productsRepository.updateById(id,{
      eliminated: true
    });
  }

    // @put('/products/{id}')
  // @response(204, {
  //   description: 'Products PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() products: Products,
  // ): Promise<void> {
  //   await this.productsRepository.replaceById(id, products);
  // }


  // @patch('/products')
  // @response(200, {
  //   description: 'Products PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Products, {partial: true}),
  //       },
  //     },
  //   })
  //   products: Products,
  //   @param.where(Products) where?: Where<Products>,
  // ): Promise<Count> {
  //   return this.productsRepository.updateAll(products, where);
  // }

  // @get('/products/count')
  // @response(200, {
  //   description: 'Products model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Products) where?: Where<Products>,
  // ): Promise<Count> {
  //   return this.productsRepository.count(where);
  // }

}
