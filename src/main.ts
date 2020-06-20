import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
