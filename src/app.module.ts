import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './users/user.module';
import { AccountModule } from './accounts/account.module';
import { TransactionModule } from './transactions/transaction.module';
import { AuthModule } from './auth/auth.module';

import { User } from './users/entities/user.entity';
import { Account } from './accounts/entities/account.entity';
import { Transaction } from './transactions/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Account, Transaction],
      synchronize: true,
    }),
    UserModule,
    AccountModule,
    TransactionModule,
    AuthModule,
  ],
})
export class AppModule {}