import { Request, Response } from 'express';
import { z } from 'zod';
import * as sharingService from './sharingService';

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['VIEWER', 'EDITOR']),
});

const updateMemberSchema = z.object({
  role: z.enum(['VIEWER', 'EDITOR', 'ADMIN']),
});

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { budgetId } = req.params;
    const { email, role } = inviteUserSchema.parse(req.body);
    // @ts-ignore
    const inviterId = req.user.id;
    await sharingService.inviteUserToBudget(budgetId, email, role, inviterId);
    res.status(200).json({ message: 'User invited successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { budgetId, memberId } = req.params;
    const { role } = updateMemberSchema.parse(req.body);
    // @ts-ignore
    const userId = req.user.id;
    await sharingService.updateMemberRole(budgetId, memberId, role, userId);
    res.status(200).json({ message: 'Member updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  const { budgetId, memberId } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  await sharingService.removeMemberFromBudget(budgetId, memberId, userId);
  res.status(200).json({ message: 'Member removed successfully' });
};