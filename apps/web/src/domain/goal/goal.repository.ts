import type { FinancialGoal } from "./goal";

export interface GoalRepository {
	getAll: () => Promise<FinancialGoal[]>;
	create: (
		goal: Omit<FinancialGoal, "id" | "currentAmount" | "userId">,
	) => Promise<FinancialGoal>;
	update: (
		id: string,
		goal: Partial<Omit<FinancialGoal, "id" | "userId">>,
	) => Promise<void>;
	delete: (id: string) => Promise<void>;
	addTransaction: (id: string, amount: number) => Promise<void>;
}
