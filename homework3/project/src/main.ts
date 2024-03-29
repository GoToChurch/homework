import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "./pipes/validation.pipe";

async function start() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT, () => {
    console.log(`Server started on Port = ${PORT}`)
  });
}

start();
