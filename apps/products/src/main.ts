import { NestFactory } from '@nestjs/core';
import { ProductModule } from '../src/product/product.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const productOptions = new DocumentBuilder()
    .setTitle('Product Module.')
    .setDescription('This is a list of product module.')
    .setVersion('1.0.0')
    .addTag('products')
    .addBearerAuth()
    .build();

  const productDocument = SwaggerModule.createDocument(app, productOptions, {
    include: [ProductModule],
  });

  SwaggerModule.setup('/api/products', app, productDocument);
  await app.listen(8081);
}
bootstrap();
