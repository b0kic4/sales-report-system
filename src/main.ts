import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rabbitMqUrl = configService.get<string>('CLOUDAMQP_URL');

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'daily_sales_report',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  };

  app.connectMicroservice(microserviceOptions);
  await app.startAllMicroservices();

  await app.listen(configService.get('PORT') || 3000);
}

bootstrap();
