import api from '@/lib/api';
import type { Budget, IBudgetRepository, PaginatedBudgets } from '@/domain/budget';

class ApiBudgetRepository implements IBudgetRepository {
  async getAll(page: number, limit: number): Promise<PaginatedBudgets> {
    const response = await api.get('/budgets', {
      params: { page, limit },
    });
    return response.data;
  }

  async getById(id: string): Promise<Budget | null> {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      // Handle cases where the budget is not found (e.g., 404)
      return null;
    }
  }
}

// Export a singleton instance of the repository.
// This ensures the rest of our app uses the same instance.
export const budgetRepository = new ApiBudgetRepository();
