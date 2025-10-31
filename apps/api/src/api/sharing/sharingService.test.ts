import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { inviteUserToBudget, updateMemberRole, removeMemberFromBudget } from './sharingService';
import prisma from '../../database/prisma';
import nodemailer from 'nodemailer';

jest.mock('../../database/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: () => Promise.resolve(),
  }),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe('inviteUserToBudget', () => {
  it('should invite a user to a budget', async () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const budget = {
      id: '1',
      name: 'Test Budget',
    };
    const budgetMember = {
      id: '1',
      budgetId: '1',
      userId: '1',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // @ts-ignore
    prismaMock.user.findUnique.mockResolvedValue(user);
    // @ts-ignore
    prismaMock.budget.findUnique.mockResolvedValue(budget);
    // @ts-ignore
    prismaMock.budgetMember.create.mockResolvedValue(budgetMember);

    const result = await inviteUserToBudget('1', 'test@example.com', 'ADMIN', '1');

    expect(result).toEqual(budgetMember);
  });
});

describe('updateMemberRole', () => {
  it('should update a member role', async () => {
    const member = {
      count: 1,
    };
    // @ts-ignore
    prismaMock.budgetMember.updateMany.mockResolvedValue(member);

    const result = await updateMemberRole('1', '1', 'EDITOR', '1');

    expect(result).toEqual(member);
  });
});

describe('removeMemberFromBudget', () => {
  it('should remove a member from a budget', async () => {
    const member = {
      count: 1,
    };
    // @ts-ignore
    prismaMock.budgetMember.deleteMany.mockResolvedValue(member);

    const result = await removeMemberFromBudget('1', '1', '1');

    expect(result).toEqual(member);
  });
});
