import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as chalk from 'chalk';

// Import configuration file.
// Note: the configuration loaded here depends on the
// environment of the application.
// If NODE_ENV is undefined, config will load the development
// configuration defined in development.yml.
const dbConfig = config.get('db');

// This code is not necessary and it is just here for debugging porpuses.
/* const env = process.env.NODE_ENV;
console.log(`Environment: ${chalk.default.bgCyan(env)}`);
const dbName = process.env.RDS_DBNAME || dbConfig.database;
console.log(`Database name: ${chalk.default.bgCyan(dbName)}`);
const dbPass = process.env.RDS_PASSWORD || dbConfig.password;
console.log(`Database password: ${chalk.default.bgCyan(dbPass)}`); */

// This file has the configuration object for TypeORM inisialization
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  // Relation Database Service (RDS) is a service in Amazon web Services
  // which is the service that will be used to have the application
  // in production mode. If the RDS variables are not provided this will
  // fallback to the loaded configuration.
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // Everytime the connection starts it is going to syncronize with the schemas in the
  // Postgres database. Should be set to false in production.
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
