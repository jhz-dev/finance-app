import type { CreateTransaction, Transaction } from "@/domain/transaction/Transaction";
import type { TransactionRepository } from "@/domain/transaction/transaction.repository";
import api from "@/lib/api";

class ApiTransactionRepository implements TransactionRepository {
	async getAll(budgetId: string): Promise<Transaction[]> {
		const response = await api.get<Transaction[]>(
			`/budgets/${budgetId}/transactions`,
		);
		return response.data;
	}

	async create(
		budgetId: string,
		transaction: CreateTransaction,
	): Promise<Transaction> {
		const response = await api.post<Transaction>(
			`/budgets/${budgetId}/transactions`,
			transaction,
		);
		return response.data;
	}

	async update(
		transactionId: string,
		transaction: Partial<Transaction>,
	): Promise<Transaction> {
		const response = await api.put<Transaction>(
			`/transactions/${transactionId}`,
			transaction,
		);
		return response.data;
	}

	async delete(transactionId: string): Promise<void> {
		await api.delete(`/transactions/${transactionId}`);
	}
}

export const transactionRepository = new ApiTransactionRepository();
