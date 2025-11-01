import type { Request, Response } from "express";
import { z } from "zod";
import * as sharingService from "./sharingService";
import { asyncHandler } from "../../../infrastructure/common/utils/asyncHandler";

const inviteUserSchema = z.object({
	email: z.string().email(),
	role: z.enum(["VIEWER", "EDITOR"]),
});

const updateMemberSchema = z.object({
	role: z.enum(["VIEWER", "EDITOR", "ADMIN"]),
});

export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
	const { budgetId } = req.params;
	const { email, role } = inviteUserSchema.parse(req.body);
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const inviterId = req.user.id;
	await sharingService.inviteUserToBudget(budgetId, email, role, inviterId);
	res.status(200).json({ message: "User invited successfully" });
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
	const { budgetId, memberId } = req.params;
	const { role } = updateMemberSchema.parse(req.body);
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	await sharingService.updateMemberRole(budgetId, memberId, role, userId);
	res.status(200).json({ message: "Member updated successfully" });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
	const { budgetId, memberId } = req.params;
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const userId = req.user.id;
	await sharingService.removeMemberFromBudget(budgetId, memberId, userId);
	res.status(200).json({ message: "Member removed successfully" });
});
