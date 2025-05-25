import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export type AccountType = 'CORRENTE' |'POUPANCA' |'CREDITO' |'INVESTIMENTO';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: AccountType;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @ManyToOne(() => User, user => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.accountOrigin)
  outgoingTransactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.accountDestination)
  incomingTransactions: Transaction[];
}