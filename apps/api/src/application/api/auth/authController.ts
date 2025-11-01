import type { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "./authService";
import { asyncHandler } from "../../../infrastructure/common/utils/asyncHandler";

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string(),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
	const userData = registerSchema.parse(req.body);
	const user = await registerUser(userData);
	res.status(201).json({ message: "User registered successfully", user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	const credentials = loginSchema.parse(req.body);
	const { user, token } = await loginUser(credentials);
	res.status(200).json({ user, token });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
	// This route is protected, so if we reach here, the user is authenticated.
	// The user object should be available in req.user from the authMiddleware.
	if (!req.user) {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}
	res.status(200).json({ user: req.user });
});
