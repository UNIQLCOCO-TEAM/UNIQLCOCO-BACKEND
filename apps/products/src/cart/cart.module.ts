import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from '../../../../libs/common/src';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
