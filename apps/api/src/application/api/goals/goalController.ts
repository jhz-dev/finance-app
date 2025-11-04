import type { Request, Response } from "express";
import { z } from "zod";
import * as goalService from "./goalService";
import { asyncHandler } from "../../../infrastructure/common/utils/asyncHandler";
import { Decimal } from "@prisma/client/runtime/library";

const goalSchema = z.object({
	name: z.string(),
	targetAmount: z.number(),
	currentAmount: z.number().optional(),
});

export const createGoal = asyncHandler(async (req: Request, res: Response) => {
	const goalData = goalSchema.parse(req.body);
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	const goal = await goalService.createGoal(
		{
			...goalData,
			targetAmount: new Decimal(goalData.targetAmount),
			currentAmount: new Decimal(goalData.currentAmount || 0),
		},
		userId,
	);
	res.status(201).json(goal);
});

export const getGoals = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	const goals = await goalService.getGoalsForUser(userId);
	res.status(200).json(goals);
});

export const updateGoal = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const goalData = goalSchema.parse(req.body);
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	const goal = await goalService.updateGoal(
		id,
		{
			...goalData,
			targetAmount: new Decimal(goalData.targetAmount),
			currentAmount: new Decimal(goalData.currentAmount || 0),
		},
		userId,
	);
	res.status(200).json(goal);
});

export const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	await goalService.deleteGoal(id, userId);
	res.status(200).json({ message: "Goal deleted successfully" });
});

export const addTransactionToGoal = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { amount } = req.body;
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userId = req.user.id;
		await goalService.addTransactionToGoal(id, amount, userId);
		res.status(200).json({ message: "Transaction added successfully" });
	},
);
