import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Bootstrap-ORDERSMS');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.NATS,
      options: {       
        servers: envs.natsServer,
      },
    }
  );
  
  app.useGlobalPipes(new ValidationPipe({     
    whitelist: true,
    forbidNonWhitelisted: true,
   }));


  await app.listen();
  logger.log(`ORDERS MICROSERVICE is running on: ${envs.PORT}`);
}
bootstrap();
