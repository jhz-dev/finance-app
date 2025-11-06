import type { Transaction } from "./Transaction";

import type { BudgetMember } from "../budget/BudgetMember";
import type { BudgetRole } from "../budget";

export interface Budget {
	id: string;
	name: string;
	balance: number;
	transactions: Transaction[];
	members: BudgetMember[];
}

export interface PaginatedBudgets {
	budgets: Budget[];
	totalBudgets: number;
}

export interface IBudgetRepository {
	getAll(page: number, limit: number): Promise<PaginatedBudgets>;
	getById(id: string): Promise<Budget | null>;
	inviteMember(budgetId: string, email: string, role: BudgetRole): Promise<void>;
	updateMemberRole(
		budgetId: string,
		memberId: string,
		role: BudgetRole,
	): Promise<void>;
	removeMember(budgetId: string, memberId: string): Promise<void>;
}
