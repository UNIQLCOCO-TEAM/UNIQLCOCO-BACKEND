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
    }),
  );
  const ordersOptions = new DocumentBuilder()
    .setTitle('Product Module.')
    .setDescription('This is a list of product module.')
    .setVersion('1.0.0')
    .addTag('products')
    .addBearerAuth()
    .build();

  const orderDocument = SwaggerModule.createDocument(app, ordersOptions, {
    include: [OrderModule],
  });

  SwaggerModule.setup('/api/products', app, orderDocument);
  await app.listen(8082);
}
bootstrap();
