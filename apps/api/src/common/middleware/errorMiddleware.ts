import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ errors: err.flatten().fieldErrors });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Email already in use.' });
    }
  }

  if (err.message === 'You are not a member of this budget' || err.message === 'You do not have permission to update this budget' || err.message === 'You do not have permission to create a transaction in this budget' || err.message === 'You do not have permission to update this transaction' || err.message === 'You do not have permission to delete this transaction') {
    return res.status(403).json({ message: err.message });
  }

  if (err.message === 'Transaction not found') {
    return res.status(404).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
};