import { Router } from 'express';
import { createBudget, getBudgets, getBudget, updateBudget, deleteBudget } from './budgetController';
import { protect } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(createBudget)
  .get(getBudgets);

router.route('/:id')
  .get(getBudget)
  .put(updateBudget)
  .delete(deleteBudget);

export default router;
