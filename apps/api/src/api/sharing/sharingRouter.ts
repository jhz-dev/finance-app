import { Router } from 'express';
import { inviteUser, updateMember, removeMember } from './sharingController';
import { protect } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/budgets/:budgetId/share', inviteUser);
router.put('/budgets/:budgetId/share/:memberId', updateMember);
router.delete('/budgets/:budgetId/share/:memberId', removeMember);

export default router;
