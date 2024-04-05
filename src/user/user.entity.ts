import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
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
}
