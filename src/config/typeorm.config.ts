import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Import configuration file
const dbConfig = config.get('db');

// This file has the configuration object for TypeORM inisialization
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // Everytime the connection starts it is going to syncronize with the schemas in the
  // Postgres database. Should be set to false in production.
  synchronize: true,
};
