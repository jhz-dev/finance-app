import prisma from '../../database/prisma';

export const createRecurringTransaction = async (data: any, budgetId: string, userId: string) => {
  const member = await prisma.budgetMember.findFirst({
    where: {
      budgetId,
      userId,
    },
  });

  if (!member && (await prisma.budget.findFirst({ where: { id: budgetId, ownerId: userId } })) === null) {
    throw new Error('You are not a member of this budget');
  }

  if (member && member.role !== 'ADMIN' && member.role !== 'EDITOR') {
    throw new Error('You do not have permission to create a recurring transaction in this budget');
  }

  const transaction = await prisma.recurringTransaction.create({
    data: {
      ...data,
      budgetId,
      userId,
    },
  });
  return transaction;
};

export const getRecurringTransactions = async (budgetId: string, userId: string) => {
  const member = await prisma.budgetMember.findFirst({
    where: {
      budgetId,
      userId,
    },
  });

  if (!member && (await prisma.budget.findFirst({ where: { id: budgetId, ownerId: userId } })) === null) {
    throw new Error('You are not a member of this budget');
  }

  const transactions = await prisma.recurringTransaction.findMany({
    where: {
      budgetId,
    },
  });
  return transactions;
};

export const updateRecurringTransaction = async (id: string, data: any, userId: string) => {
  const transactionToUpdate = await prisma.recurringTransaction.findUnique({
    where: { id },
  });

  if (!transactionToUpdate) {
    throw new Error('Recurring transaction not found');
  }

  const member = await prisma.budgetMember.findFirst({
    where: {
      budgetId: transactionToUpdate.budgetId,
      userId,
    },
  });

  if (!member && (await prisma.budget.findFirst({ where: { id: transactionToUpdate.budgetId, ownerId: userId } })) === null) {
    throw new Error('You are not a member of this budget');
  }

  if (member && member.role !== 'ADMIN' && member.role !== 'EDITOR') {
    throw new Error('You do not have permission to update this recurring transaction');
  }

  const transaction = await prisma.recurringTransaction.update({
    where: {
      id,
    },
    data,
  });
  return transaction;
};

export const deleteRecurringTransaction = async (id: string, userId: string) => {
  const transactionToDelete = await prisma.recurringTransaction.findUnique({
    where: { id },
  });

  if (!transactionToDelete) {
    throw new Error('Recurring transaction not found');
  }

  const member = await prisma.budgetMember.findFirst({
    where: {
      budgetId: transactionToDelete.budgetId,
      userId,
    },
  });

  if (!member && (await prisma.budget.findFirst({ where: { id: transactionToDelete.budgetId, ownerId: userId } })) === null) {
    throw new Error('You are not a member of this budget');
  }

  if (member && member.role !== 'ADMIN' && member.role !== 'EDITOR') {
    throw new Error('You do not have permission to delete this recurring transaction');
  }

  const transaction = await prisma.recurringTransaction.delete({
    where: {
      id,
    },
  });
  return transaction;
};
