import express, { type Express } from "express";
import cors from "cors";
import authRouter from "../application/api/auth/authRouter";
import budgetRouter from "../application/api/budgets/budgetRouter";
import transactionRouter from "../application/api/transactions/transactionRouter";
import sharingRouter from "../application/api/sharing/sharingRouter";
import categoryRouter from "../application/api/categories/categoryRouter";
import goalRouter from "../application/api/goals/goalRouter";
import recurringTransactionRouter from "../application/api/recurring-transactions/recurringTransactionRouter";
import { errorHandler } from "./common/middleware/errorMiddleware";

export function createServer(): Express {
	const app = express();

	app.use(express.json());
	app.use(cors());

	app.use("/api/auth", authRouter);
	app.use("/api/budgets", budgetRouter);
	app.use("/api", transactionRouter);
	app.use("/api", sharingRouter);
	app.use("/api/categories", categoryRouter);
	app.use("/api/goals", goalRouter);
	app.use("/api", recurringTransactionRouter);

	app.get("/healthcheck", (_, res) => {
		res.status(200).send("OK");
	});

	app.use(errorHandler);

	return app;
}
