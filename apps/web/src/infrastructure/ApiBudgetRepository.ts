import type {
	Budget,
	IBudgetRepository,
	PaginatedBudgets,
} from "@/domain/transaction/budget";
import type { RecurringTransaction } from "@/domain/transaction/recurring-transaction";
import api from "@/lib/api";

class ApiBudgetRepository implements IBudgetRepository {
	async getAll(page: number, limit: number): Promise<PaginatedBudgets> {
		const response = await api.get("/budgets", {
			params: { page, limit },
		});
		return response.data;
	}

	async getById(id: string): Promise<Budget | null> {
		try {
			const response = await api.get(`/budgets/${id}`);
			return response.data;
		} catch (_error) {
			// Handle cases where the budget is not found (e.g., 404)
			return null;
		}
	}

	async inviteUser(budgetId: string, email: string, role: string): Promise<void> {
		await api.post(`/budgets/${budgetId}/share`, { email, role });
	}

	async updateMemberRole(budgetId: string, memberId: string, role: string): Promise<void> {
		await api.put(`/budgets/${budgetId}/share/${memberId}`, { role });
	}

	async removeMember(budgetId: string, memberId: string): Promise<void> {
		await api.delete(`/budgets/${budgetId}/share/${memberId}`);
	}

	async addRecurringTransaction(
		budgetId: string,
		transaction: Omit<RecurringTransaction, "id" | "budgetId" | "userId">,
	): Promise<void> {
		await api.post(
			`/budgets/${budgetId}/recurring-transactions`,
			transaction,
		);
	}
}

// Export a singleton instance of the repository.
// This ensures the rest of our app uses the same instance.
export const budgetRepository = new ApiBudgetRepository();
