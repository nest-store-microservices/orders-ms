import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Bootstrap-ORDERSMS');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.TCP,
      options: {       
        port: envs.PORT,
      },
    }
  );
  await app.listen();
  logger.log(`ORDERS MICROSERVICE is running on: ${envs.PORT}`);
}
bootstrap();
