import prisma from '../../database/prisma';

export const createTransaction = async (data: any, budgetId: string, userId: string) => {
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
  const transaction = await prisma.transaction.updateMany({
    where: {
      id,
      userId, // Users can only update their own transactions
    },
    data,
  });
  return transaction;
};

export const deleteTransaction = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.deleteMany({
    where: {
      id,
      userId, // Users can only delete their own transactions
    },
  });
  return transaction;
};
