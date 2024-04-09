import { NestFactory } from '@nestjs/core';
import { ProductModule } from '../src/product/product.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CartModule } from './cart/cart.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
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
  const productOptions = new DocumentBuilder()
    .setTitle('Product Module.')
    .setDescription('This is a list of product module.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const cartOptions = new DocumentBuilder()
    .setTitle('Cart Module.')
    .setDescription('This is a list of cart module.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const productDocument = SwaggerModule.createDocument(app, productOptions, {
    include: [ProductModule],
  });

  const cartDocument = SwaggerModule.createDocument(app, cartOptions, {
    include: [CartModule],
  });

  SwaggerModule.setup('/api/products', app, productDocument);
  SwaggerModule.setup('/api/carts', app, cartDocument);
  await app.listen(8081);
}
bootstrap();
