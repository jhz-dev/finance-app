import type { Request, Response } from "express";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler = (err: Error, _req: Request, res: Response) => {
	if (err instanceof z.ZodError) {
		return res.status(400).json({ errors: err.flatten().fieldErrors });
	}

	if (err instanceof PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			return res.status(409).json({ message: "Email already in use." });
		}
	}

	if (
		err.message === "You are not a member of this budget" ||
		err.message === "You do not have permission to update this budget" ||
		err.message ===
			"You do not have permission to create a transaction in this budget" ||
		err.message === "You do not have permission to update this transaction" ||
		err.message === "You do not have permission to delete this transaction"
	) {
		return res.status(403).json({ message: err.message });
	}

	if (err.message === "Transaction not found") {
		return res.status(404).json({ message: err.message });
	}

	console.error(err.stack);
	res.status(500).json({ message: "Server error" });
};
