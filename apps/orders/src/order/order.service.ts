import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, Repository } from 'typeorm';
import { User } from '../../../authentication/src/user/entities/user.entity';
import { Cart } from '../../../products/src/cart/entities/cart.entity';
import { Product } from '../../../products/src/product/entities/product.entity';
import { Status } from '../../../products/src/cart/enum/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const user: User = await this.userRepository.findOne({
      where: { uid: createOrderDto.uid },
    });
    const cart: Cart = await this.cartRepository.findOne({
      where: {
        id: createOrderDto.cart_id,
      },
    });
    cart.status = Status.ACTIVE;
    await this.cartRepository.save(cart);

    const cartsSet = Array.from(new Set(cart.carts));
    const productsMap = new Map<number, number>();
    cartsSet.forEach((product) => {
      const id = product.id;
      const count = productsMap.get(id) ?? 0;
      productsMap.set(id, count + 1);
    });

    productsMap.forEach(async (val, key) => {
      const product: Product = await this.productRepository.findOne({
        where: { id: key },
      });
      product.inventory -= val;
      await this.productRepository.update(key, product);
    });

    const order: Order = new Order();
    order.uid = user.uid;
    order.address = user.address;
    order.cart_id = cart.id;
    order.products = cart.carts;
    order.fees = cart.fees;
    order.total_price = cart.total_price;
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

  findByUid(uid: number) {
    return this.orderRepository.find({
      where: {
        uid: uid,
      },
    });
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }

  async getTotalUser() {
    // eslint-disable-next-line prefer-const
    let totalUser = [];
    const orders: Order[] = await this.orderRepository.find();
    orders.forEach(async (order) => {
      totalUser.push(order.uid);
    });
    return Array.from(new Set(totalUser)).length;
  }

  isLeapYear(year: number): boolean {
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        return year % 400 === 0;
      }
      return true;
    }
    return false;
  }

  async getTopSeller() {
    // eslint-disable-next-line prefer-const
    let productsMap = new Map<number, number>();
    // eslint-disable-next-line prefer-const
    let todayProductMap = new Map<number, number>();
    const currentMonth = new Date().getMonth();
    const endDate = await this.findEndDate(currentMonth);
    const orders: Order[] = await this.getOrder(currentMonth, endDate);
    const todayOrders: Order[] = await this.getTodayOrder(currentMonth);

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const id = product.id;
        const count = productsMap.get(id) ?? 0;
        productsMap.set(id, count + 1);
      });
    });
    todayOrders.forEach((order) => {
      order.products.forEach((product) => {
        const id = product.id;
        const count = todayProductMap.get(id) ?? 0;
        todayProductMap.set(id, count + 1);
      });
    });

    const entries = Array.from(productsMap.entries()).sort(
      (a, b) => b[1] - a[1],
    );
    const newProductsMap = new Map(entries);
    console.log(newProductsMap);
    // eslint-disable-next-line prefer-const
    let topProductSeller = [];
    await Promise.all(
      Array.from(newProductsMap.entries()).map(async ([key, val]) => {
        const product = await this.productRepository.findOne({
          where: {
            id: key,
          },
        });
        console.log(product);
        topProductSeller.push({
          ...product,
          total: val * product.price,
          today: todayProductMap.get(key) * product.price,
        });
      }),
    );
    return topProductSeller;
  }

  async getStatsOverview() {
    const productsMap: Map<number, number> = new Map<number, number>();
    const orders: Order[] = await this.orderRepository.find();
    orders.forEach((order) => {
      order.products.forEach((product) => {
        const id = product.type;
        const count = productsMap.get(id) ?? 0;
        productsMap.set(id, count + 1);
      });
    });
    return { shirt: productsMap.get(1), pants: productsMap.get(2) };
  }

  async findEndDate(month: number) {
    const endDate = [0, 2, 4, 6, 7, 9, 11].includes(month)
      ? 31
      : month === 1 && this.isLeapYear(new Date().getFullYear())
        ? 29
        : !this.isLeapYear(new Date().getFullYear())
          ? 28
          : 30;
    return endDate;
  }

  async getTodayOrder(
    month: number,
    today: number = new Date().getDate(),
  ): Promise<Order[]> {
    const orders: Order[] = await this.orderRepository.find({
      where: {
        time: Between(
          new Date(new Date().getFullYear(), month, today, 0, 0, 0, 0),
          new Date(new Date().getFullYear(), month, today, 23, 59, 59, 59),
        ),
      },
    });
    return orders;
  }

  async getOrder(month: number, endDate: number): Promise<Order[]> {
    const orders: Order[] = await this.orderRepository.find({
      where: {
        time: Between(
          new Date(new Date().getFullYear(), month, 0, 0, 0, 0, 0),
          new Date(new Date().getFullYear(), month, endDate, 23, 59, 59, 59),
        ),
      },
    });
    return orders;
  }

  async getOrdersInComePerMonth(
    month: number,
    endDate: number,
  ): Promise<number> {
    const orders: Order[] = await this.orderRepository.find({
      where: {
        time: Between(
          new Date(new Date().getFullYear(), month, 0, 0, 0, 0, 0),
          new Date(new Date().getFullYear(), month, endDate, 23, 59, 59, 59),
        ),
      },
    });
    let totalInCome = 0;
    orders.forEach((order) => {
      totalInCome += order.total_price + order.fees;
    });
    return totalInCome;
  }

  async getTotalInComePerMonth() {
    // eslint-disable-next-line prefer-const
    let incomeLists = [];
    for (let i: number = 0; i < 12; i++) {
      const endDate = await this.findEndDate(i);
      const income: number = await this.getOrdersInComePerMonth(i, endDate);
      incomeLists.push({ [i + 1]: income });
    }
    return incomeLists;
  }

  async getPopularProduct() {
    const topSeller = await this.getTopSeller();
    return topSeller.slice(0, 3);
  }
}
