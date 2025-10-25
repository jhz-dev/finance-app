import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from './goalController';
import { protect } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(createGoal)
  .get(getGoals);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

export default router;
