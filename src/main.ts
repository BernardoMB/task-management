import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

/**
 * Applications entry point
 *
 */
async function bootstrap() {
  // Configuration for running the application
  // default.yml is the default configurtation if NODE_ENV is undefined.
  // NODE_ENV is undefined by default.
  // Note: To run the application defining the port as an environment
  // variable run the following command: PORT=3001 npm run start:dev.
  // With this, the port on which the aplication runs should be 3001.
  // Sensitive information must be provided using environment variables.
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;
  // Passing bootstrap because the logger is used inside the bootstrap function.
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  // Implement application level pipes
  // app.useGlobalPipes(SomePipe);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
