import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// This file has the configuration object for TypeORM inisialization
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '9058',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // Everytime the connection starts it is going to syncronize with the schemas in the
  // Postgres database. Should be set to false in production.
  synchronize: true,
};
