import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { Product } from '../../../../products/src/product/entities/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  order_id: number;

  @Column({ type: 'int', name: 'uid', nullable: false })
  uid: number;

  @Column({ type: 'varchar', name: 'address', nullable: false })
  address: string;

  @Column({ type: 'int', name: 'cart_id', nullable: false })
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
