import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CartModule } from '../cart/cart.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Product]),
    CartModule,
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
