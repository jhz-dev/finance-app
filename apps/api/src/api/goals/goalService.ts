import prisma from '../../database/prisma';

export const createGoal = async (data: any, userId: string) => {
  const goal = await prisma.financialGoal.create({
    data: {
      ...data,
      userId,
    },
  });
  return goal;
};

export const getGoalsForUser = async (userId: string) => {
  const goals = await prisma.financialGoal.findMany({
    where: { userId },
  });
  return goals;
};

export const updateGoal = async (id: string, data: any, userId: string) => {
  const goal = await prisma.financialGoal.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });
  return goal;
};

export const deleteGoal = async (id: string, userId: string) => {
  const goal = await prisma.financialGoal.deleteMany({
    where: {
      id,
      userId,
    },
  });
  return goal;
};
