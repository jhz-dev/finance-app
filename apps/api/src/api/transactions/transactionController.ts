import { Request, Response } from 'express';
import { z } from 'zod';
import * as transactionService from './transactionService';
import { asyncHandler } from '../../common/utils/asyncHandler';

const transactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE', 'TAX', 'LOAN']),
  date: z.string().datetime(),
  categoryId: z.string().optional(),
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  const transactionData = transactionSchema.parse(req.body);
  const userId = req.user.id;
  const transaction = await transactionService.createTransaction(transactionData, budgetId, userId);
  res.status(201).json(transaction);
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transactionData = transactionSchema.parse(req.body);
  const userId = req.user.id;
  await transactionService.updateTransaction(id, transactionData, userId);
  res.status(200).json({ message: 'Transaction updated successfully' });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  await transactionService.deleteTransaction(id, userId);
  res.status(200).json({ message: 'Transaction deleted successfully' });
});
