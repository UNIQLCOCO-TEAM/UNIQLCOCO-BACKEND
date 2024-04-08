import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { UserModule } from './user/user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const userOptions = new DocumentBuilder()
    .setTitle('User Module.')
    .setDescription('This is a list of user module.')
    .setVersion('1.0.0')
    .addTag('User')
    .addBearerAuth()
    .build();

  const authOptions = new DocumentBuilder()
    .setTitle('Account Module.')
    .setDescription('This is a list of account module.')
    .setVersion('1.0.0')
    .addTag('Account')
    .addBearerAuth()
    .build();

  const userDocument = SwaggerModule.createDocument(app, userOptions, {
    include: [UserModule],
  });

  const authDocument = SwaggerModule.createDocument(app, authOptions, {
    include: [AuthModule],
  });

  SwaggerModule.setup('/api/user', app, userDocument);
  SwaggerModule.setup('/api/account', app, authDocument);
  await app.listen(8080);
}
bootstrap();
