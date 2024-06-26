import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  size: string;

  @Column({ type: 'int', name: 'inventory', nullable: false })
  inventory: number;

  @Column({ type: 'int', name: 'type', nullable: false })
  type: number;

  @Column({ type: 'varchar', nullable: false })
  image_file: string;

  @Column({ type: 'varchar', name: 'sound', nullable: true })
  sound: string;
}
