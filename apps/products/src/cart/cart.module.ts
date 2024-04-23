import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Cart } from './entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../../../authentication/src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Cart, Product, User])],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
