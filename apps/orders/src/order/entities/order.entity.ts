import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../authentication/src/user/entities/user.entity';
import { Delivery } from './delivery.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  order_id: number;

  @ManyToOne(() => User, (User) => User.uid, { cascade: true })
  @JoinColumn({ name: 'uid' })
  uid: number;

  @ManyToOne(() => User, (User) => User.address, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'address' })
  address: number;

  @Column({ type: 'json', name: 'products', nullable: false })
  products: number[];

  @ManyToMany(() => Delivery, (Delivery) => Delivery.id, { cascade: true })
  @JoinColumn({ name: 'delivery_type' })
  delivery_type: number;

  @ManyToMany(() => Payment, (Payment) => Payment.id, { cascade: true })
  @JoinColumn({ name: 'payment_type' })
  payment_type: number;

  @Column({ type: 'timestamp', name: 'time', nullable: false })
  time: Date;
}
