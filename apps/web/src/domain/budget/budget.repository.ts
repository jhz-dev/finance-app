import type { Budget, PaginatedBudgets, BudgetRole } from "./Budget";

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