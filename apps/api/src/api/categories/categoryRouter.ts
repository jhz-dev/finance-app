import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from './categoryController';
import { protect } from '../../common/middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(createCategory)
  .get(getCategories);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
