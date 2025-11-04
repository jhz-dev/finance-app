import { Router } from "express";
import {
	createGoal,
	getGoals,
	updateGoal,
	deleteGoal,
	addTransactionToGoal,
} from "./goalController";
import { protect } from "../../../infrastructure/common/middleware/authMiddleware";

const router = Router();

router.use(protect);

router.route("/").post(createGoal).get(getGoals);

router.route("/:id").put(updateGoal).delete(deleteGoal);

router.route("/:id/transactions").post(addTransactionToGoal);

export default router;
