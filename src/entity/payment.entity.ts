import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  txnNo: string;

  @Column()
  amount: number;

  @Column()
  status: boolean;
}
