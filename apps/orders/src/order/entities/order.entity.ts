import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { Product } from '../../../../products/src/product/entities/product.entity';
import { Cart } from '../../../../products/src/cart/entities/cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  order_id: number;

  @Column({ type: 'int', name: 'uid', nullable: false })
  uid: number;

  @Column({ type: 'varchar', name: 'address', nullable: false })
  address: string;

  @OneToOne(() => Cart, (Cart) => Cart.id, { cascade: true })
  @JoinColumn({ name: 'cart_id' })
  cart_id: number;

  @Column({ type: 'json', name: 'products', nullable: false })
  products: Product[];

  @Column({ type: 'int', name: 'delivery_fee', nullable: false })
  fees: number;

  @Column({ type: 'int', name: 'total_price', nullable: false })
  total_price: number;

  @ManyToOne(() => Payment, (Payment) => Payment.id, { cascade: true })
  @JoinColumn({ name: 'payment_type' })
  payment_type: number;

  @Column({ type: 'timestamp', name: 'time', nullable: false })
  time: Date;
}
