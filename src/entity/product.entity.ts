import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Color } from './color.entity';
import { Category } from './category.entity';
import { Country } from './country.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

//Keep index on top of the class
@Index('idx_product_name', ['name'], { fulltext: true })
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  date_available: Date;

  @Column()
  manufacturer: string;

  @Column({ nullable: true })
  brandRank: number;

  @Column({ nullable: true })
  categoryRank: number;

  @Column({ type: 'longtext', nullable: true })
  image: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand)
  brand: Brand;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => Country)
  country: Country;

  @ManyToMany(() => Color, (color) => color.products)
  @JoinTable({ name: 'product_color' })
  colors: Color[];

  @ManyToMany(() => User, (user) => user.wishlists)
  wishlistUsers: User[];

  @ManyToMany(() => User, (user) => user.carts)
  cartUsers: User[];

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
