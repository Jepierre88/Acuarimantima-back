import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {AcuarimantimaDataSource} from '../datasources';
import {Products, ProductsRelations, DetailAccount} from '../models';
import {DetailAccountRepository} from './detail-account.repository';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {

  constructor(
    @inject('datasources.acuarimantima') dataSource: AcuarimantimaDataSource,
  ) {
    super(Products, dataSource);

  }
}
