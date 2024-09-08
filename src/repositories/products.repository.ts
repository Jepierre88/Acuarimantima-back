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

  public readonly detailAccounts: HasManyRepositoryFactory<DetailAccount, typeof Products.prototype.id>;

  constructor(
    @inject('datasources.acuarimantima') dataSource: AcuarimantimaDataSource, @repository.getter('DetailAccountRepository') protected detailAccountRepositoryGetter: Getter<DetailAccountRepository>,
  ) {
    super(Products, dataSource);
    this.detailAccounts = this.createHasManyRepositoryFactoryFor('detailAccounts', detailAccountRepositoryGetter,);
    this.registerInclusionResolver('detailAccounts', this.detailAccounts.inclusionResolver);
  }
}
