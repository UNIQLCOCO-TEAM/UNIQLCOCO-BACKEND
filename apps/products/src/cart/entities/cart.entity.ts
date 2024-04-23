import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enum/status.enum';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: Status,
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

  @Column({ type: 'int', name: 'uid', nullable: false })
  uid: number;
}
