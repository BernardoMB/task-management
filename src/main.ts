import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

/**
 * Applications entry point
 *
 */
async function bootstrap() {
  // Instanciating the logger class passing bootstrap
  // This logger is being instanciated inside the bootstrap function
  const logger = new Logger('bootstrap');

  // Get server confguration.
  // The package config will load the configuration accordingly
  // to the mode in which the application is running on.
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);
  logger.log(`Application running on ${process.env.NODE_ENV} environment`);

  // Configure the application to enable CORS in development mode
  if (process.env.NODE_ENV === 'development') {
    // Application is in development mode
    app.enableCors({ origin: '*' });
    logger.log('Accepting requests from any origin');
  } else {
    // Application is in production mode
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  }

  // Implement application level pipes
  // app.useGlobalPipes(SomePipe);

  await app.listen(port);
  // Passing bootstrap because the logger is used inside the bootstrap function.
  logger.log(
    `Application listening on port ${port} under ${
      process.env.NODE_ENV
    } environment`,
  );
}
bootstrap();
