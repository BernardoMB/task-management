import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Applications entry point
 *
 */
async function bootstrap() {
  // Passing bootstrap because the logger is used inside the bootstrap function.
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  // Implement application level pipes
  // app.useGlobalPipes(SomePipe);
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
