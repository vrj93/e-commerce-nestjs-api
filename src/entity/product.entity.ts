import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Brand)
  brand: Brand;
}
