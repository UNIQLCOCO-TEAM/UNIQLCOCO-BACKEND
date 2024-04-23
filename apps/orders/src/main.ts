import { NestFactory } from '@nestjs/core';
import { OrderModule } from '../src/order/order.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const ordersOptions = new DocumentBuilder()
    .setTitle('Order Module.')
    .setDescription('This is a list of order module.')
    .setVersion('1.0.0')
    .addTag('dashboard')
    .addBearerAuth()
    .build();

  const orderDocument = SwaggerModule.createDocument(app, ordersOptions, {
    include: [OrderModule],
  });

  SwaggerModule.setup('/api/orders', app, orderDocument);
  await app.listen(8082);
}
bootstrap();
