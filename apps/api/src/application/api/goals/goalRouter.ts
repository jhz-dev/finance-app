import { Router } from "express";
import {
	createGoal,
	getGoals,
	updateGoal,
	deleteGoal,
	addTransactionToGoal,
	updateGoalTransaction,
	removeTransactionFromGoal,
} from "./goalController";
import { protect } from "../../../infrastructure/common/middleware/authMiddleware";

const router = Router();

router.use(protect);

router.route("/").post(createGoal).get(getGoals);

router.route("/:id").put(updateGoal).delete(deleteGoal);

router.route("/:goalId/transactions").post(addTransactionToGoal);
router
	.route("/:goalId/transactions/:transactionId")
	.put(updateGoalTransaction)
	.delete(removeTransactionFromGoal);

export default router;
