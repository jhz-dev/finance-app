import type {
	CreateFinancialGoal,
	FinancialGoal,
	UpdateFinancialGoal,
} from "./goal";

export interface IGoalRepository {
	getAll: () => Promise<FinancialGoal[]>;
	create: (goal: CreateFinancialGoal) => Promise<FinancialGoal>;
	update: (id: string, goal: UpdateFinancialGoal) => Promise<void>;
	delete: (id: string) => Promise<void>;
	addTransaction: (id: string, amount: number) => Promise<void>;
}
