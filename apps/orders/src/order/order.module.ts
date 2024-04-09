import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Order } from './entities/order.entity';
import { User } from '../../../authentication/src/user/entities/user.entity';
import { Product } from '../../../products/src/product/entities/product.entity';
import { Payment } from './entities/payment.entity';
import { Cart } from '../../../products/src/cart/entities/cart.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Order, User, Product, Payment, Cart]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
