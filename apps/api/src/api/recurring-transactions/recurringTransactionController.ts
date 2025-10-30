import { Request, Response } from 'express';
import { z } from 'zod';
import * as recurringTransactionService from './recurringTransactionService';
import { asyncHandler } from '../../common/utils/asyncHandler';

const recurringTransactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE', 'TAX', 'LOAN']),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().optional(),
});

export const createRecurringTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  const transactionData = recurringTransactionSchema.parse(req.body);
  const userId = req.user.id;
  const transaction = await recurringTransactionService.createRecurringTransaction(transactionData, budgetId, userId);
  res.status(201).json(transaction);
});

export const getRecurringTransactions = asyncHandler(async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  const userId = req.user.id;
  const transactions = await recurringTransactionService.getRecurringTransactions(budgetId, userId);
  res.status(200).json(transactions);
});

export const updateRecurringTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transactionData = recurringTransactionSchema.parse(req.body);
  const userId = req.user.id;
  await recurringTransactionService.updateRecurringTransaction(id, transactionData, userId);
  res.status(200).json({ message: 'Recurring transaction updated successfully' });
});

export const deleteRecurringTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  await recurringTransactionService.deleteRecurringTransaction(id, userId);
  res.status(200).json({ message: 'Recurring transaction deleted successfully' });
});
