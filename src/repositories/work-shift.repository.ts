import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {AcuarimantimaDataSource} from '../datasources';
import {WorkShift, WorkShiftRelations, Account} from '../models';
import {AccountRepository} from './account.repository';

export class WorkShiftRepository extends DefaultCrudRepository<
  WorkShift,
  typeof WorkShift.prototype.id,
  WorkShiftRelations
> {

  public readonly accounts: HasManyRepositoryFactory<Account, typeof WorkShift.prototype.id>;

  constructor(
    @inject('datasources.acuarimantima') dataSource: AcuarimantimaDataSource, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(WorkShift, dataSource);
    this.accounts = this.createHasManyRepositoryFactoryFor('accounts', accountRepositoryGetter,);
    this.registerInclusionResolver('accounts', this.accounts.inclusionResolver);
  }
}
