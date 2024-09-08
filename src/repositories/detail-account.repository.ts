import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AcuarimantimaDataSource} from '../datasources';
import {DetailAccount, DetailAccountRelations} from '../models';

export class DetailAccountRepository extends DefaultCrudRepository<
  DetailAccount,
  typeof DetailAccount.prototype.id,
  DetailAccountRelations
> {
  constructor(
    @inject('datasources.acuarimantima') dataSource: AcuarimantimaDataSource,
  ) {
    super(DetailAccount, dataSource);
  }
}
