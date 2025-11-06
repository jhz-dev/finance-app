import type { Transaction } from "./Transaction";

import type { BudgetMember } from "../budget/BudgetMember";

// This is the core data structure for a Budget.
// It lives in the domain because it represents a core business concept.
export interface Budget {
	id: string;
	name: string;
	balance: number;
	transactions: Transaction[];
	members: BudgetMember[];
	// In the future, this might include calculated properties like balance.
}

export interface PaginatedBudgets {
	budgets: Budget[];
	totalBudgets: number;
}

import type { BudgetRole } from "../budget/Budget";

// This is a "Port" in Hexagonal Architecture.
// It defines a contract for data access without specifying the implementation.
// The application core will depend on this interface, not on a concrete implementation.
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
	// In the future, we would add methods like:
	// create(name: string): Promise<Budget>;
}
