import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {AcuarimantimaDataSource} from '../datasources';
import {Account, AccountRelations, DetailAccount} from '../models';
import {DetailAccountRepository} from './detail-account.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {

  public readonly detailAccounts: HasManyRepositoryFactory<DetailAccount, typeof Account.prototype.id>;

  constructor(
    @inject('datasources.acuarimantima') dataSource: AcuarimantimaDataSource, @repository.getter('DetailAccountRepository') protected detailAccountRepositoryGetter: Getter<DetailAccountRepository>,
  ) {
    super(Account, dataSource);
    this.detailAccounts = this.createHasManyRepositoryFactoryFor('detailAccounts', detailAccountRepositoryGetter,);
    this.registerInclusionResolver('detailAccounts', this.detailAccounts.inclusionResolver);
  }
}
