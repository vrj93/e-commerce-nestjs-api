import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  orderId: string;

  @Column()
  arrivalDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product, (product) => product.orders, { cascade: true })
  @JoinTable({ name: 'order_product' })
  products: Product[];

  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;
}
