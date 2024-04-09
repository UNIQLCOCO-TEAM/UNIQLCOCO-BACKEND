import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from '../../../authentication/src/user/entities/user.entity';
import { Cart } from '../../../products/src/cart/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const user: User = await this.userRepository.findOne({
      where: { uid: createOrderDto.uid },
    });
    const card_id: Cart = await this.cartRepository.findOne({
      where: {
        id: createOrderDto.cart_id,
      },
    });
    const order: Order = new Order();
    order.uid = user.uid;
    order.address = user.address;
    order.cart_id = card_id.id;
    order.products = card_id.carts;
    order.fees = card_id.fees;
    order.total_price = card_id.total_price;
    order.payment_type = createOrderDto.payment_type;
    order.time = createOrderDto.time;

    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: number) {
    return this.orderRepository.findOne({
      where: {
        order_id: id,
      },
    });
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
