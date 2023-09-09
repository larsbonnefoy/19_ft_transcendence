import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // to communicate from vue to nest
//   app.use(cors())
  app.useGlobalPipes(new ValidationPipe());
  // app.setGlobalPrefix('api'); // New
  await app.listen(3000);
}
bootstrap();
