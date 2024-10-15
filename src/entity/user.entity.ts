import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column('blob')
  password: Buffer;

  @Column({ default: false })
  is_phone: boolean;

  @Column({ default: false })
  is_email: boolean;

  @Column({ type: 'int', nullable: true })
  otp: number;

  @Column('blob')
  iv_code: Buffer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @ManyToMany(() => Product, (product) => product.wishlistUsers, {
    cascade: true,
  })
  @JoinTable({ name: 'wishlists' })
  wishlists: Product[];

  @ManyToMany(() => Product, (product) => product.cartUsers, { cascade: true })
  @JoinTable({ name: 'carts' })
  carts: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
