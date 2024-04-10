import {
  Column,
  CreateDateColumn,
  Entity,
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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Brand)
  brand: Brand;
  @ManyToOne(() => Category)
  category: Category;
  @Column()
  price: number;
  @Column()
  quantity: number;
  @Column()
  date_available: Date;
  @Column()
  manufacturer: string;
  @ManyToOne(() => Country)
  country: Country;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Color, (color) => color.products)
  @JoinTable({ name: 'product_color' })
  colors: Color[];
}
