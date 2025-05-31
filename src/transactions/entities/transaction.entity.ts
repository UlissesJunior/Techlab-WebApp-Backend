import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { IsOptional } from 'class-validator';

export type TransactionType = 'DEBITO' | 'CREDITO' | 'TRANSFERENCIA';

  @Entity()
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: TransactionType;

    @ManyToOne(() => Account, account => account.outgoingTransactions, { nullable: true, onDelete: 'SET NULL' })
    accountOrigin: Account;

    @ManyToOne(() => Account, account => account.incomingTransactions, { nullable: true, onDelete: 'SET NULL' })
    accountDestination: Account;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'datetime', nullable: true })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;
  }