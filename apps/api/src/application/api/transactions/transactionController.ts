import type { Request, Response } from "express";
import { z } from "zod";
import * as transactionService from "./transactionService";
import { asyncHandler } from "../../../infrastructure/common/utils/asyncHandler";
import { Decimal } from "@prisma/client/runtime/library";

const transactionSchema = z.object({
	description: z.string(),
	amount: z.number(),
	type: z.enum(["INCOME", "EXPENSE", "TAX", "LOAN"]),
	date: z.string().datetime(),
	categoryId: z.string().optional(),
	goalId: z.string().optional(),
});

export const createTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { budgetId } = req.params;
		const transactionData = transactionSchema.parse(req.body);
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		const transaction = await transactionService.createTransaction(
			{
				...transactionData,
				amount: new Decimal(transactionData.amount),
				date: new Date(transactionData.date),
				categoryId: transactionData.categoryId ?? null,
				goalId: transactionData.goalId ?? null,
			},
			budgetId,
			userId,
		);
		res.status(201).json(transaction);
	},
);

export const updateTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const transactionData = transactionSchema.parse(req.body);
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		await transactionService.updateTransaction(
			id,
			{
				...transactionData,
				amount: new Decimal(transactionData.amount),
				date: new Date(transactionData.date),
				categoryId: transactionData.categoryId ?? null,
			},
			userId,
		);
		res.status(200).json({ message: "Transaction updated successfully" });
	},
);

export const deleteTransaction = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		await transactionService.deleteTransaction(id, userId);
		res.status(200).json({ message: "Transaction deleted successfully" });
	},
);
