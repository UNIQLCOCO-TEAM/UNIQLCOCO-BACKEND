import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  account_id: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(() => User, (User) => User.uid, { cascade: true })
  @JoinColumn({ name: 'uid' })
  uid: number;

  @Column({ type: 'timestamp' })
  last_logged_in: Date;

  @Column({ type: 'json', nullable: false })
  logged_id_history: Date[];

  @Column({ type: 'varchar' })
  access_token: string;
}
