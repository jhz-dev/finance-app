import type { Transaction } from './transaction';

export interface TransactionRepository {
  getAll(budgetId: string): Promise<Transaction[]>;
  create(budgetId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
  update(transactionId: string, transaction: Partial<Transaction>): Promise<Transaction>;
  delete(transactionId: string): Promise<void>;
}
