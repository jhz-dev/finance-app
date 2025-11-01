import type { Budget, Transaction } from "@prisma/client";
import prisma from "../../../infrastructure/database/prisma";

export const createBudget = async (name: string, userId: string) => {
	const budget = await prisma.budget.create({
		data: {
			name,
			ownerId: userId,
		},
	});
	return budget;
};

export const getBudgetsForUser = async (
	userId: string,
	page: number,
	limit: number,
) => {
	const where = {
		OR: [
			{ ownerId: userId },
			{
				members: {
					some: {
						userId: userId,
					},
				},
			},
		],
	};

	const budgets = await prisma.budget.findMany({
		where,
		skip: (page - 1) * limit,
		take: limit,
		include: {
			transactions: {
				include: {
					category: true,
				},
			},
		},
	});

	const totalBudgets = await prisma.budget.count({ where });

	const budgetsWithBalance = budgets.map(
		(budget: Budget & { transactions: Transaction[] }) => {
			const balance = budget.transactions.reduce(
				(acc: number, transaction: Transaction) => {
					if (transaction.type === "INCOME") {
						return acc + Number(transaction.amount);
					} else {
						return acc - Number(transaction.amount);
					}
				},
				0,
			);
			return { ...budget, balance };
		},
	);

	return { budgets: budgetsWithBalance, totalBudgets };
};

export const getBudgetById = async (budgetId: string, userId: string) => {
	const budget = await prisma.budget.findFirst({
		where: {
			id: budgetId,
			OR: [
				{ ownerId: userId },
				{
					members: {
						some: {
							userId: userId,
						},
					},
				},
			],
		},
		include: {
			transactions: {
				include: {
					category: true,
				},
			},
			members: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!budget) {
		return null;
	}

	const balance = budget.transactions.reduce(
		(acc: number, transaction: Transaction) => {
			if (transaction.type === "INCOME") {
				return acc + Number(transaction.amount);
			} else {
				return acc - Number(transaction.amount);
			}
		},
		0,
	);

	return { ...budget, balance };
};

export const updateBudget = async (
	budgetId: string,
	name: string,
	userId: string,
) => {
	const member = await prisma.budgetMember.findFirst({
		where: {
			budgetId,
			userId,
		},
	});

	if (
		!member &&
		(await prisma.budget.findFirst({
			where: { id: budgetId, ownerId: userId },
		})) === null
	) {
		throw new Error("You are not a member of this budget");
	}

	if (member && member.role !== "ADMIN" && member.role !== "EDITOR") {
		throw new Error("You do not have permission to update this budget");
	}

	const budget = await prisma.budget.updateMany({
		where: {
			id: budgetId,
		},
		data: {
			name,
		},
	});
	return budget;
};

export const deleteBudget = async (budgetId: string, userId: string) => {
	const budget = await prisma.budget.deleteMany({
		where: {
			id: budgetId,
			ownerId: userId, // Only the owner can delete the budget
		},
	});
	return budget;
};
