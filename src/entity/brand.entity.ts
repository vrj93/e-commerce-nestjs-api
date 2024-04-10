import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
