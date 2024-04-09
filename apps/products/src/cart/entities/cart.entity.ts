import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../enum/status.enum';
// import { Product } from '../../product/entities/product.entity';
import { User } from '../../../../authentication/src/user/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    name: 'status',
    nullable: false,
  })
  status: Status;

  @Column({
    type: 'json',
    name: 'carts',
    nullable: true,
  })
  carts: any[];

  @Column({ type: 'int', name: 'total_price', nullable: true })
  total_price: number;

  @Column({ type: 'int', name: 'delivery_fee', nullable: true })
  fees: number;

  @ManyToOne(() => User, (User) => User.uid, { cascade: true })
  @JoinColumn({ name: 'uid' })
  uid: number;
}
