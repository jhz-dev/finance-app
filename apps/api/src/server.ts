import express, { Express } from 'express';
import cors from 'cors';
import authRouter from './api/auth/authRouter';
import budgetRouter from './api/budgets/budgetRouter';
import transactionRouter from './api/transactions/transactionRouter';
import sharingRouter from './api/sharing/sharingRouter';
import categoryRouter from './api/categories/categoryRouter';
import goalRouter from './api/goals/goalRouter';

export function createServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/api/auth', authRouter);
  app.use('/api/budgets', budgetRouter);
  app.use('/api', transactionRouter);
  app.use('/api', sharingRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/goals', goalRouter);

  app.get('/healthcheck', (_, res) => {
    res.status(200).send('OK');
  });

  return app;
}
