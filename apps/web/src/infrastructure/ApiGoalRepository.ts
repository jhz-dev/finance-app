import type {
	CreateFinancialGoal,
	FinancialGoal,
	UpdateFinancialGoal,
} from "@/domain/goal/goal";
import type { IGoalRepository } from "@/domain/goal/goal.repository";
import api from "@/lib/api";

class ApiGoalRepository implements IGoalRepository {
	async getAll(): Promise<FinancialGoal[]> {
		const response = await api.get("/goals");
		return response.data;
	}

	async create(goal: CreateFinancialGoal): Promise<FinancialGoal> {
		const response = await api.post("/goals", goal);
		return response.data;
	}

	async update(id: string, goal: UpdateFinancialGoal): Promise<void> {
		await api.put(`/goals/${id}`, goal);
	}

	async delete(id: string): Promise<void> {
		await api.delete(`/goals/${id}`);
	}

	async addTransaction(id: string, amount: number): Promise<void> {
		await api.post(`/goals/${id}/transactions`, { amount });
	}
}

export const apiGoalRepository = new ApiGoalRepository();
