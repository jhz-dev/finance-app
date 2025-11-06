import type { CreateTransaction, Transaction } from "./Transaction";

export interface TransactionRepository {
	getAll(budgetId: string): Promise<Transaction[]>;
	create(
		budgetId: string,
		transaction: CreateTransaction,
	): Promise<Transaction>;
	update(
		transactionId: string,
		transaction: Partial<Transaction>,
	): Promise<Transaction>;
	delete(transactionId: string): Promise<void>;
}
