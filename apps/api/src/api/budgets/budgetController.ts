import { Request, Response } from 'express';
import { z } from 'zod';
import * as budgetService from './budgetService';
import { asyncHandler } from '../../common/utils/asyncHandler';

const createBudgetSchema = z.object({
  name: z.string().min(2),
});

const updateBudgetSchema = z.object({
  name: z.string().min(2),
});

export const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const { name } = createBudgetSchema.parse(req.body);
  const userId = req.user.id;
  const budget = await budgetService.createBudget(name, userId);
  res.status(201).json(budget);
});

const getBudgetsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { page, limit } = getBudgetsSchema.parse(req.query);
  const budgets = await budgetService.getBudgetsForUser(userId, page, limit);
  res.status(200).json(budgets);
});

export const getBudget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const budget = await budgetService.getBudgetById(id, userId);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }
  res.status(200).json(budget);
});

export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = updateBudgetSchema.parse(req.body);
  const userId = req.user.id;
  await budgetService.updateBudget(id, name, userId);
  res.status(200).json({ message: 'Budget updated successfully' });
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  await budgetService.deleteBudget(id, userId);
  res.status(200).json({ message: 'Budget deleted successfully' });
});
