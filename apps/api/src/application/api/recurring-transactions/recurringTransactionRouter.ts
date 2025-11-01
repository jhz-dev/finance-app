import { Router } from "express";
import { protect } from "../../../infrastructure/common/middleware/authMiddleware";
import {
	createRecurringTransaction,
	getRecurringTransactions,
	updateRecurringTransaction,
	deleteRecurringTransaction,
} from "./recurringTransactionController";

const router = Router();

router.use(protect);

router
	.route("/budgets/:budgetId/recurring-transactions")
	.post(createRecurringTransaction)
	.get(getRecurringTransactions);

router
	.route("/recurring-transactions/:id")
	.put(updateRecurringTransaction)
	.delete(deleteRecurringTransaction);

export default router;
