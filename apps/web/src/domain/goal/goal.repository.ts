import type { FinancialGoal } from "./goal";

export interface GoalRepository {
	getAll: () => Promise<FinancialGoal[]>;
	getById: (id: string) => Promise<FinancialGoal>;
	create: (
		goal: Omit<FinancialGoal, "id" | "userId">,
	) => Promise<FinancialGoal>;
	update: (
		id: string,
		goal: Partial<Omit<FinancialGoal, "id" | "userId">>,
	) => Promise<void>;
	delete: (id: string) => Promise<void>;
	addTransaction: (
		goalId: string,
		transactionId: string,
		amount: number,
	) => Promise<void>;
}
