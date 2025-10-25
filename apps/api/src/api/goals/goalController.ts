import { Request, Response } from 'express';
import { z } from 'zod';
import * as goalService from './goalService';

const goalSchema = z.object({
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number().optional(),
});

export const createGoal = async (req: Request, res: Response) => {
  try {
    const goalData = goalSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    const goal = await goalService.createGoal(goalData, userId);
    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGoals = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  const goals = await goalService.getGoalsForUser(userId);
  res.status(200).json(goals);
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goalData = goalSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    const goal = await goalService.updateGoal(id, goalData, userId);
    res.status(200).json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  await goalService.deleteGoal(id, userId);
  res.status(200).json({ message: 'Goal deleted successfully' });
};