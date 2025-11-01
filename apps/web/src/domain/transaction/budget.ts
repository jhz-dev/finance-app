import type { RecurringTransaction } from "./recurring-transaction";
import type { Transaction } from "./transaction";

export type BudgetRole = "VIEWER" | "EDITOR" | "ADMIN";

export interface BudgetMember {
	id: string;
	userId: string;
	user: {
		id: string;
		name: string | null;
		email: string;
	};
	role: BudgetRole;
}

// This is the core data structure for a Budget.
// It lives in the domain because it represents a core business concept.
export interface Budget {
	id: string;
	name: string;
	balance: number;
	ownerId: string;
	transactions: Transaction[];
	members: BudgetMember[];
	recurringTransactions: RecurringTransaction[];
	// In the future, this might include calculated properties like balance.
}

export interface PaginatedBudgets {
	budgets: Budget[];
	totalBudgets: number;
}

// This is a "Port" in Hexagonal Architecture.
// It defines a contract for data access without specifying the implementation.
// The application core will depend on this interface, not on a concrete implementation.
export interface IBudgetRepository {
	getAll(page: number, limit: number): Promise<PaginatedBudgets>;
	getById(id: string): Promise<Budget | null>;
	inviteUser(budgetId: string, email: string, role: BudgetRole): Promise<void>;
	updateMemberRole(
		budgetId: string,
		memberId: string,
		role: BudgetRole,
	): Promise<void>;
	removeMember(budgetId: string, memberId: string): Promise<void>;
	addRecurringTransaction(
		budgetId: string,
		transaction: Omit<RecurringTransaction, "id" | "budgetId" | "userId">,
	): Promise<void>;
	// In the future, we would add methods like:
	// create(name: string): Promise<Budget>;
}
