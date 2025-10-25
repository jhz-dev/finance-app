import { Router } from 'express';
import { createTransaction, updateTransaction, deleteTransaction } from './transactionController';
import { protect } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/budgets/:budgetId/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;
