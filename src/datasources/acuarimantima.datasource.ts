import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {configDotenv} from 'dotenv';


configDotenv()
const config = {
  name: 'acuarimantima',
  connector: 'mysql',
  url: '',
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWD,
  database: process.env.DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AcuarimantimaDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'acuarimantima';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.acuarimantima', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
