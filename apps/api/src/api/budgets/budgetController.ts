import { Request, Response } from 'express';
import { z } from 'zod';
import * as budgetService from './budgetService';

const createBudgetSchema = z.object({
  name: z.string().min(2),
});

const updateBudgetSchema = z.object({
  name: z.string().min(2),
});

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { name } = createBudgetSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    const budget = await budgetService.createBudget(name, userId);
    res.status(201).json(budget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getBudgetsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const getBudgets = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { page, limit } = getBudgetsSchema.parse(req.query);
    const budgets = await budgetService.getBudgetsForUser(userId, page, limit);
    res.status(200).json(budgets);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  const budget = await budgetService.getBudgetById(id, userId);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }
  res.status(200).json(budget);
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = updateBudgetSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    await budgetService.updateBudget(id, name, userId);
    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  await budgetService.deleteBudget(id, userId);
  res.status(200).json({ message: 'Budget deleted successfully' });
};