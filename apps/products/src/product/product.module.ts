import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
