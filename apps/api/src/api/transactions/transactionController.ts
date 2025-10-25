import { Request, Response } from 'express';
import { z } from 'zod';
import * as transactionService from './transactionService';

const transactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE', 'TAX', 'LOAN']),
  date: z.string().datetime(),
  categoryId: z.string().optional(),
});

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { budgetId } = req.params;
    const transactionData = transactionSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    const transaction = await transactionService.createTransaction(transactionData, budgetId, userId);
    res.status(201).json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transactionData = transactionSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    await transactionService.updateTransaction(id, transactionData, userId);
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  await transactionService.deleteTransaction(id, userId);
  res.status(200).json({ message: 'Transaction deleted successfully' });
};