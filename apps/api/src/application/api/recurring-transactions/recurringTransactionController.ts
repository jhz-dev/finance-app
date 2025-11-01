import type { Request, Response } from "express";
import { z } from "zod";
import * as recurringTransactionService from "./recurringTransactionService";
import { asyncHandler } from "../../../infrastructure/common/utils/asyncHandler";
import { Decimal } from "@prisma/client/runtime/library";

const recurringTransactionSchema = z.object({
	description: z.string(),
	amount: z.number(),
	type: z.enum(["INCOME", "EXPENSE", "TAX", "LOAN"]),
	frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
	startDate: z.string().datetime(),
	endDate: z.string().datetime().optional(),
	categoryId: z.string().optional(),
});

export const createRecurringTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { budgetId } = req.params;
		const transactionData = recurringTransactionSchema.parse(req.body);
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		const transaction =
			await recurringTransactionService.createRecurringTransaction(
				{
					...transactionData,
					amount: new Decimal(transactionData.amount),
					startDate: new Date(transactionData.startDate),
					endDate: transactionData.endDate
						? new Date(transactionData.endDate)
						: null,
					categoryId: transactionData.categoryId ?? null,
				},
				budgetId,
				userId,
			);
		res.status(201).json(transaction);
	},
);

export const getRecurringTransactions = asyncHandler(
	async (req: Request, res: Response) => {
		const { budgetId } = req.params;
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		const transactions =
			await recurringTransactionService.getRecurringTransactions(
				budgetId,
				userId,
			);
		res.status(200).json(transactions);
	},
);

export const updateRecurringTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const transactionData = recurringTransactionSchema.parse(req.body);
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		await recurringTransactionService.updateRecurringTransaction(
			id,
			{
				...transactionData,
				amount: new Decimal(transactionData.amount),
				startDate: new Date(transactionData.startDate),
				endDate: transactionData.endDate
					? new Date(transactionData.endDate)
					: null,
				categoryId: transactionData.categoryId ?? null,
			},
			userId,
		);
		res
			.status(200)
			.json({ message: "Recurring transaction updated successfully" });
	},
);

export const deleteRecurringTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		await recurringTransactionService.deleteRecurringTransaction(id, userId);
		res
			.status(200)
			.json({ message: "Recurring transaction deleted successfully" });
	},
);
