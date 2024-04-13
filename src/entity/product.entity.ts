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

//Keep index on top of the class
@Index('idx_product_name', ['name'], { fulltext: true })
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
  @Column({ nullable: true })
  brandRank: number;
  @Column({ nullable: true })
  categoryRank: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Color, (color) => color.products)
  @JoinTable({ name: 'product_color' })
  colors: Color[];
}
