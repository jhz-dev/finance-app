export interface FinancialGoal {
	id: string;
	name: string;
	targetAmount: number;
	currentAmount: number;
	userId: string;
}

export type CreateFinancialGoal = Omit<
	FinancialGoal,
	"id" | "currentAmount" | "userId"
>;

export type UpdateFinancialGoal = Partial<Omit<FinancialGoal, "id" | "userId">>;
