import api from '@/lib/api';
import type { Budget, IBudgetRepository } from '@/domain/budget';

class ApiBudgetRepository implements IBudgetRepository {
  async getAll(): Promise<Budget[]> {
    const response = await api.get('/budgets');
    return response.data;
  }
}

// Export a singleton instance of the repository.
// This ensures the rest of our app uses the same instance.
export const budgetRepository = new ApiBudgetRepository();
