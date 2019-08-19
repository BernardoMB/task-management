import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Implement application level pipes
  // app.useGlobalPipes(SomePipe);
  await app.listen(3000);
}
bootstrap();
