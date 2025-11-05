import prisma from "../../../infrastructure/database/prisma";
import type { FinancialGoal } from "@prisma/client";

export const createGoal = async (data: Omit<FinancialGoal, "id" | "userId" | "createdAt" | "updatedAt">, userId: string) => {
	const goal = await prisma.financialGoal.create({
		data: {
			...data,
			userId,
		},
	});
	return goal;
};

export const addTransactionToGoal = async (
	id: string,
	amount: number,
	userId: string,
) => {
	const goal = await prisma.financialGoal.findFirst({
		where: { id, userId },
	});
	if (!goal) {
		throw new Error("Goal not found");
	}
	await prisma.financialGoal.update({
		where: { id },
		data: {
			currentAmount: {
				increment: amount,
			},
		},
	});
	const budgets = await prisma.budget.findMany({
		where: { ownerId: userId },
	});
	if (budgets.length === 0) {
		throw new Error("No budgets found for user");
	}
	await prisma.transaction.create({
		data: {
			amount,
			description: `Transaction for goal: ${goal.name}`,
			type: "EXPENSE",
			date: new Date(),
			userId,
			budgetId: budgets[0].id,
			goalId: id,
		},
	});
};

export const getGoalsForUser = async (userId: string) => {
	const goals = await prisma.financialGoal.findMany({
		where: { userId },
	});
	return goals;
};

export const updateGoal = async (id: string, data: Partial<Omit<FinancialGoal, "id" | "userId" | "createdAt" | "updatedAt">>, userId: string) => {
	const goal = await prisma.financialGoal.updateMany({
		where: {
			id,
			userId,
		},
		data,
	});
	return goal;
};

export const deleteGoal = async (id: string, userId: string) => {
	const goal = await prisma.financialGoal.deleteMany({
		where: {
			id,
			userId,
		},
	});
	return goal;
};
