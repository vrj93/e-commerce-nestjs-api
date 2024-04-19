import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  house: string;
  @Column()
  street: string;
  @Column({ nullable: true })
  locality: string;
  @Column()
  city: string;
  @Column()
  pincode: number;
  @Column()
  state: string;
  @Column()
  country: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
