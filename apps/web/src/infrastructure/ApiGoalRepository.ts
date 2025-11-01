import type { GoalRepository } from "@/domain/goal/goal.repository";
import api from "@/lib/api";

export const goalRepository: GoalRepository = {
	getAll: async () => {
		const response = await api.get("/goals");
		return response.data;
	},
	getById: async (id) => {
		const response = await api.get(`/goals/${id}`);
		return response.data;
	},
	create: async (goal) => {
		const response = await api.post("/goals", goal);
		return response.data;
	},
	update: async (id, goal) => {
		await api.put(`/goals/${id}`, goal);
	},
	delete: async (id) => {
		await api.delete(`/goals/${id}`);
	},
	addTransaction: async (goalId, transactionId, amount) => {
		await api.post(`/goals/${goalId}/transactions`, {
			transactionId,
			amount,
		});
	},
};
