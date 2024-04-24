import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Product } from './product.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  orderId: string;

  @Column({ nullable: true })
  arrivalDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product, (product) => product.orders, { cascade: true })
  @JoinTable({ name: 'order_product' })
  products: Product[];

  @ManyToOne(() => Address, (address) => address.orders, { nullable: true })
  address: Address | null;

  @OneToOne(() => Payment, { nullable: true })
  @JoinColumn()
  payment: Payment | null;
}
