import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Product]), CartModule],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
