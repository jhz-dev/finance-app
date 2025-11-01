import prisma from "../../../infrastructure/database/prisma";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "node:fs";
import path from "node:path";
import type { BudgetRole } from "@prisma/client";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const emailInvitationTemplateSource = fs.readFileSync(
	path.join(__dirname, "../../../infrastructure/templates/budget-invitation.hbs"),
	"utf8",
);
const invitationTemplate = handlebars.compile(emailInvitationTemplateSource);

const emailRoleUpdatedTemplateSource = fs.readFileSync(
	path.join(
		__dirname,
		"../../../infrastructure/templates/budget-role-updated.hbs",
	),
	"utf8",
);
const roleUpdatedTemplate = handlebars.compile(emailRoleUpdatedTemplateSource);

const emailMemberRemovedTemplateSource = fs.readFileSync(
	path.join(
		__dirname,
		"../../../infrastructure/templates/budget-member-removed.hbs",
	),
	"utf8",
);
const memberRemovedTemplate = handlebars.compile(
	emailMemberRemovedTemplateSource,
);

export const inviteUserToBudget = async (
	budgetId: string,
	email: string,
	role: BudgetRole,
	inviterId: string,
) => {
	const inviter = await prisma.user.findUnique({ where: { id: inviterId } });
	const userToInvite = await prisma.user.findUnique({ where: { email } });

	if (!userToInvite) {
		throw new Error("User not found");
	}

	const budget = await prisma.budget.findUnique({ where: { id: budgetId } });

	if (!budget) {
		throw new Error("Budget not found");
	}

	const member = await prisma.budgetMember.create({
		data: {
			budgetId,
			userId: userToInvite.id,
			role,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER,
		to: email,
		subject: `You have been invited to the budget: ${budget.name}`,
		html: invitationTemplate({
			inviterName: inviter?.name,
			budgetName: budget.name,
		}),
	};

	await transporter.sendMail(mailOptions);

	return member;
};

export const updateMemberRole = async (
	budgetId: string,
	memberId: string,
	role: BudgetRole,
	userId: string,
) => {
	const updater = await prisma.user.findUnique({ where: { id: userId } });
	const memberToUpdate = await prisma.budgetMember.findUnique({
		where: { id: memberId },
		include: { user: true, budget: true },
	});

	if (!memberToUpdate || memberToUpdate.budget.ownerId !== userId) {
		throw new Error("Member not found or user is not the budget owner");
	}

	const updatedMember = await prisma.budgetMember.update({
		where: {
			id: memberId,
		},
		data: {
			role,
		},
		include: {
			user: true,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER,
		to: updatedMember.user.email,
		subject: `Your role in budget: ${memberToUpdate.budget.name} has been updated`,
		html: roleUpdatedTemplate({
			updaterName: updater?.name,
			budgetName: memberToUpdate.budget.name,
			newRole: role,
		}),
	};

	await transporter.sendMail(mailOptions);

	return updatedMember;
};

export const removeMemberFromBudget = async (
	budgetId: string,
	memberId: string,
	userId: string,
) => {
	const remover = await prisma.user.findUnique({ where: { id: userId } });
	const memberToRemove = await prisma.budgetMember.findUnique({
		where: { id: memberId },
		include: { user: true, budget: true },
	});

	if (!memberToRemove || memberToRemove.budget.ownerId !== userId) {
		throw new Error("Member not found or user is not the budget owner");
	}

	await prisma.budgetMember.delete({
		where: {
			id: memberId,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER,
		to: memberToRemove.user.email,
		subject: `You have been removed from the budget: ${memberToRemove.budget.name}`,
		html: memberRemovedTemplate({
			removerName: remover?.name,
			budgetName: memberToRemove.budget.name,
		}),
	};

	await transporter.sendMail(mailOptions);
};
