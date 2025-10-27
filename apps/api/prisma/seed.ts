import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.transaction.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('Created test user:');
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: password123`);

  // 3. Create budgets for the user
  const personalBudget = await prisma.budget.create({
    data: {
      name: 'Personal Expenses',
      ownerId: user.id,
    },
  });

  const vacationBudget = await prisma.budget.create({
    data: {
      name: 'Vacation Fund',
      ownerId: user.id,
    },
  });

  console.log(`Created 2 budgets for ${user.name}`);

  // 4. Create transactions for the Personal Expenses budget
  await prisma.transaction.createMany({
    data: [
      {
        description: 'Groceries',
        amount: 75.50,
        type: 'EXPENSE',
        date: new Date(),
        budgetId: personalBudget.id,
        userId: user.id,
      },
      {
        description: 'Salary',
        amount: 2500.00,
        type: 'INCOME',
        date: new Date(),
        budgetId: personalBudget.id,
        userId: user.id,
      },
      {
        description: 'Gasoline',
        amount: 40.00,
        type: 'EXPENSE',
        date: new Date(),
        budgetId: personalBudget.id,
        userId: user.id,
      },
    ],
  });

  // 5. Create transactions for the Vacation Fund budget
  await prisma.transaction.createMany({
    data: [
      {
        description: 'Initial Deposit',
        amount: 500.00,
        type: 'INCOME',
        date: new Date(),
        budgetId: vacationBudget.id,
        userId: user.id,
      },
      {
        description: 'Plane tickets',
        amount: 850.00,
        type: 'EXPENSE',
        date: new Date(),
        budgetId: vacationBudget.id,
        userId: user.id,
      },
    ],
  });

  console.log('Created transactions for both budgets.');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
