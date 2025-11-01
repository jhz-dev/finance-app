import type { Transaction } from "../transaction/transaction";

export interface GoalTransaction {
  id: string;
  amount: number;
  transaction: Transaction;
  transactionId: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  userId: string;
  goalTransactions: GoalTransaction[];
}
