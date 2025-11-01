import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../database/prisma";

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let token: string | undefined;

	if (req.headers.authorization?.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not defined");
			}
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
				id: string;
			};
			req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
			next();
		} catch {
			res.status(401).json({ message: "Not authorized, token failed" });
		}
	}

	if (!token) {
		res.status(401).json({ message: "Not authorized, no token" });
	}
};
