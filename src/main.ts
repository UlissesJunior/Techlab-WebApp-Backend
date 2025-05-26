import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, unlinkSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { GlobalValidationPipe } from './common/pipe/global-validation.pipe';

async function bootstrap() {
  const dbFile = 'db.sqlite';
  
  if (existsSync(dbFile)) {
    unlinkSync(dbFile);
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(GlobalValidationPipe);

  const transformInterceptor = new TransformInterceptor();
  app.useGlobalInterceptors(transformInterceptor);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();