import prisma from '../../database/prisma';

export const createTransaction = async (data: any, budgetId: string, userId: string) => {
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
    throw new Error('You do not have permission to create a transaction in this budget');
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      budgetId,
      userId,
    },
  });
  return transaction;
};

export const updateTransaction = async (id: string, data: any, userId: string) => {
  const transactionToUpdate = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transactionToUpdate) {
    throw new Error('Transaction not found');
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
    throw new Error('You do not have permission to update this transaction');
  }

  const transaction = await prisma.transaction.update({
    where: {
      id,
    },
    data,
  });
  return transaction;
};

export const deleteTransaction = async (id: string, userId: string) => {
  const transactionToDelete = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transactionToDelete) {
    throw new Error('Transaction not found');
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
    throw new Error('You do not have permission to delete this transaction');
  }

  const transaction = await prisma.transaction.delete({
    where: {
      id,
    },
  });
  return transaction;
};
