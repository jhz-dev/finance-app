import prisma from '../../database/prisma';

export const createBudget = async (name: string, userId: string) => {
  const budget = await prisma.budget.create({
    data: {
      name,
      ownerId: userId,
    },
  });
  return budget;
};

export const getBudgetsForUser = async (userId: string) => {
  const budgets = await prisma.budget.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      transactions: true,
    },
  });

  return budgets.map(budget => {
    const balance = budget.transactions.reduce((acc, transaction) => {
      if (transaction.type === 'INCOME') {
        return acc + Number(transaction.amount);
      } else {
        return acc - Number(transaction.amount);
      }
    }, 0);
    return { ...budget, balance };
  });
};

export const getBudgetById = async (budgetId: string, userId: string) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      transactions: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!budget) {
    return null;
  }

  const balance = budget.transactions.reduce((acc, transaction) => {
    if (transaction.type === 'INCOME') {
      return acc + Number(transaction.amount);
    } else {
      return acc - Number(transaction.amount);
    }
  }, 0);

  return { ...budget, balance };
};

export const updateBudget = async (budgetId: string, name: string, userId: string) => {
  const budget = await prisma.budget.updateMany({
    where: {
      id: budgetId,
      ownerId: userId, // Only the owner can update the name
    },
    data: {
      name,
    },
  });
  return budget;
};

export const deleteBudget = async (budgetId: string, userId: string) => {
  const budget = await prisma.budget.deleteMany({
    where: {
      id: budgetId,
      ownerId: userId, // Only the owner can delete the budget
    },
  });
  return budget;
};
