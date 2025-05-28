import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() 
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  
  photo?: string;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];
}