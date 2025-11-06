export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  budgetId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export type CreateTransaction = Omit<
  Transaction,
  "id" | "budgetId" | "createdAt" | "updatedAt"
>;

export interface UpdateTransactionPayload {
    transactionId: string;
    transaction: Partial<Transaction>;
}
