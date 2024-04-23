import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../../../authentication/src/user/entities/user.entity';
import { UpdateStatus } from './dto/update-status.dto';
import { Status } from './enum/status.enum';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const productLists = [];
    let totalPrice = 0;

    await Promise.all(
      createCartDto.products_id.map(async (id) => {
        const product: Product = await this.productRepository.findOne({
          where: { id: id },
        });
        productLists.push(product);
        totalPrice += product.price;
      }),
    );

    const cart: Cart = new Cart();
    cart.status = createCartDto.status;
    cart.total_price = totalPrice;
    cart.carts = productLists;
    cart.fees = productLists.length < 5 ? 80 : 0;
    cart.uid = createCartDto.uid;

    return await this.cartRepository.save(cart);
  }

  findAll() {
    return this.cartRepository.find();
  }

  async findOne(id: number) {
    return await this.cartRepository.findOne({
      where: { id: id },
    });
  }

  async findUIDActiveCart(id: number) {
    // if (updateStatus.status == Status.ACTIVE) console.log(true);
    // return await this.cartRepository.find({
    //   where: {
    //     status: updateStatus.status,
    //   },
    // });
    return await this.cartRepository.findOne({
      where: { uid: id, status: Status.ACTIVE },
    });
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const productLists: Product[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalPrice = 0;
    await Promise.all(
      updateCartDto.products_id.map(async (id) => {
        const product: Product = await this.productRepository.findOne({
          where: { id: id },
        });
        productLists.push(product);
        totalPrice += product.price;
      }),
    );
    const cart: Cart = new Cart();
    cart.id = id;
    cart.status = updateCartDto.status;
    cart.total_price = totalPrice;
    cart.fees = productLists.length < 5 ? 80 : 0;
    cart.uid = updateCartDto.uid;
    cart.carts = productLists;
    return this.cartRepository.save(cart);
  }

  async updateCartStatus(id: number, updateStatus: UpdateStatus) {
    const cart: Cart = await this.cartRepository.findOne({ where: { id: id } });
    const updateCart: Cart = {
      ...cart,
      status: updateStatus.status,
    };
    return this.cartRepository.save(updateCart);
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
