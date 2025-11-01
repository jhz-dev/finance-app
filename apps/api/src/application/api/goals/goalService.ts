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
	goalId: string,
	transactionId: string,
	amount: Decimal,
	userId: string,
) => {
	const goal = await prisma.financialGoal.findFirst({
		where: { id: goalId, userId },
	});
	if (!goal) {
		throw new Error("Goal not found or user does not have access");
	}
	const goalTransaction = await prisma.goalTransaction.create({
		data: {
			goalId,
			transactionId,
			amount,
		},
	});
	await prisma.financialGoal.update({
		where: { id: goalId },
		data: {
			currentAmount: {
				increment: amount,
			},
		},
	});
	return goalTransaction;
};

export const updateGoalTransaction = async (
	transactionId: string,
	amount: Decimal,
	userId: string,
) => {
	const goalTransaction = await prisma.goalTransaction.findFirst({
		where: { transaction: { id: transactionId, userId } },
	});
	if (!goalTransaction) {
		throw new Error("Transaction not found or user does not have access");
	}
	const amountDifference = amount.minus(goalTransaction.amount);
	await prisma.financialGoal.update({
		where: { id: goalTransaction.goalId },
		data: {
			currentAmount: {
				increment: amountDifference,
			},
		},
	});
	const updatedTransaction = await prisma.goalTransaction.update({
		where: { id: goalTransaction.id },
		data: { amount },
	});
	return updatedTransaction;
};

export const removeTransactionFromGoal = async (
	transactionId: string,
	userId: string,
) => {
	const goalTransaction = await prisma.goalTransaction.findFirst({
		where: { transaction: { id: transactionId, userId } },
	});
	if (!goalTransaction) {
		throw new Error("Transaction not found or user does not have access");
	}
	await prisma.financialGoal.update({
		where: { id: goalTransaction.goalId },
		data: {
			currentAmount: {
				decrement: goalTransaction.amount,
			},
		},
	});
	await prisma.goalTransaction.delete({
		where: { id: goalTransaction.id },
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
