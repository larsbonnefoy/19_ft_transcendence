import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() 
{
// somewhere in your initialization file
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();  // to communicate from vue to nest
  // app.setGlobalPrefix('api'); // New
  await app.listen(3000);
}
bootstrap();
