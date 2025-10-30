import prisma from '../../database/prisma';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { BudgetRole } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailTemplateSource = fs.readFileSync(path.join(__dirname, '../../templates/budget-invitation.hbs'), 'utf8');
const template = handlebars.compile(emailTemplateSource);

export const inviteUserToBudget = async (budgetId: string, email: string, role: BudgetRole, inviterId: string) => {
  const inviter = await prisma.user.findUnique({ where: { id: inviterId } });
  const userToInvite = await prisma.user.findUnique({ where: { email } });

  if (!userToInvite) {
    throw new Error('User not found');
  }

  const budget = await prisma.budget.findUnique({ where: { id: budgetId } });

  if (!budget) {
    throw new Error('Budget not found');
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
    html: template({ inviterName: inviter?.name, budgetName: budget.name }),
  };

  await transporter.sendMail(mailOptions);

  return member;
};

export const updateMemberRole = async (budgetId: string, memberId: string, role: BudgetRole, userId: string) => {
  const member = await prisma.budgetMember.updateMany({
    where: {
      id: memberId,
      budgetId,
      budget: {
        ownerId: userId, // Only owner can update roles
      },
    },
    data: {
      role,
    },
  });
  return member;
};

export const removeMemberFromBudget = async (budgetId: string, memberId: string, userId: string) => {
  const member = await prisma.budgetMember.deleteMany({
    where: {
      id: memberId,
      budgetId,
      budget: {
        ownerId: userId, // Only owner can remove members
      },
    },
  });
  return member;
};
